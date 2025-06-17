import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { MeterProvider } from '@opentelemetry/sdk-metrics';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { trace, metrics, context, SpanStatusCode, SpanKind } from '@opentelemetry/api';

// Initialize telemetry
const telemetryResource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: 'ragbot-llm-client',
  [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
  [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
});

// Configure Jaeger exporter for distributed tracing
const jaegerExporter = new JaegerExporter({
  endpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
});

// Configure Prometheus exporter for metrics
const prometheusExporter = new PrometheusExporter({
  port: parseInt(process.env.PROMETHEUS_PORT || '9090'),
}, () => {
  console.log('Prometheus metrics available at http://localhost:9090/metrics');
});

// Initialize tracer provider
const tracerProvider = new NodeTracerProvider({
  resource: telemetryResource,
});

tracerProvider.addSpanProcessor(new BatchSpanProcessor(jaegerExporter));
tracerProvider.register();

// Initialize meter provider
const meterProvider = new MeterProvider({
  resource: telemetryResource,
  readers: [prometheusExporter],
});

metrics.setGlobalMeterProvider(meterProvider);

// Get tracer and meter instances
export const tracer = trace.getTracer('ragbot-llm-client', '1.0.0');
export const meter = metrics.getMeter('ragbot-llm-client', '1.0.0');

// Create metrics
export const llmRequestCounter = meter.createCounter('llm_requests_total', {
  description: 'Total number of LLM requests',
});

export const llmRequestDuration = meter.createHistogram('llm_request_duration_seconds', {
  description: 'Duration of LLM requests in seconds',
  unit: 'seconds',
});

export const llmTokensUsed = meter.createCounter('llm_tokens_used_total', {
  description: 'Total number of tokens used by LLM',
});

export const embeddingRequestCounter = meter.createCounter('embedding_requests_total', {
  description: 'Total number of embedding requests',
});

export const embeddingRequestDuration = meter.createHistogram('embedding_request_duration_seconds', {
  description: 'Duration of embedding requests in seconds',
  unit: 'seconds',
});

// Initialize Node SDK with auto-instrumentations
const sdk = new NodeSDK({
  resource: telemetryResource,
  instrumentations: [getNodeAutoInstrumentations()],
});

// Helper function to instrument async operations
export async function instrumentAsyncOperation<T>(
  operationName: string,
  operation: () => Promise<T>,
  attributes?: Record<string, string | number | boolean>
): Promise<T> {
  const span = tracer.startSpan(operationName, {
    kind: SpanKind.CLIENT,
    attributes: {
      'operation.type': 'llm',
      ...attributes,
    },
  });

  const startTime = Date.now();

  try {
    const result = await context.with(trace.setSpan(context.active(), span), operation);
    
    const duration = (Date.now() - startTime) / 1000;
    span.setStatus({ code: SpanStatusCode.OK });
    span.setAttributes({
      'operation.duration': duration,
      'operation.success': true,
    });

    return result;
  } catch (error) {
    const duration = (Date.now() - startTime) / 1000;
    span.setStatus({ 
      code: SpanStatusCode.ERROR, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
    span.setAttributes({
      'operation.duration': duration,
      'operation.success': false,
      'error.message': error instanceof Error ? error.message : 'Unknown error',
    });
    
    throw error;
  } finally {
    span.end();
  }
}

// Initialize the SDK
export function initializeTelemetry() {
  if (process.env.ENABLE_TELEMETRY !== 'false') {
    sdk.start();
    console.log('OpenTelemetry initialized successfully');
  }
}