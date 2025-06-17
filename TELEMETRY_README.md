# OpenTelemetry Instrumentation for LLM Client

This project now includes comprehensive OpenTelemetry instrumentation to monitor and observe LLM (Large Language Model) operations, providing insights into performance, usage patterns, and system behavior.

## Features

### 🔍 **Distributed Tracing**
- **LLM Request Tracing**: Track individual chat completion requests with detailed spans
- **Embedding Operations**: Monitor document embedding and query embedding operations
- **RAG Pipeline Tracing**: Full observability of the Retrieval-Augmented Generation flow
- **Vector Store Operations**: Track AstraDB vector store initialization and queries
- **API Request Tracing**: Monitor full API request lifecycle from HTTP to response

### 📊 **Metrics Collection**
- **Request Counters**: Track total number of LLM requests, embedding requests, and API calls
- **Duration Histograms**: Measure response times for all operations
- **Token Usage Tracking**: Monitor token consumption (prompt, completion, and total tokens)
- **Error Rates**: Track failed requests and their causes
- **RAG Metrics**: Measure retrieval performance and document relevance

### 🎯 **Semantic Attributes**
- **LLM Model Tracking**: Identify which models are being used (GPT-4, embeddings, etc.)
- **Operation Types**: Distinguish between different types of operations
- **Request Metadata**: Track message counts, document counts, character counts
- **Performance Metrics**: Duration, success/failure status, error messages

## Architecture

### Core Components

1. **Telemetry Service** (`app/services/telemetry/index.ts`)
   - OpenTelemetry configuration and initialization
   - Tracer and meter setup
   - Metric definitions
   - Helper functions for instrumentation

2. **Instrumented OpenAI Service** (`app/services/openAI/index.ts`)
   - Extended ChatOpenAI and OpenAIEmbeddings classes
   - Automatic tracing of LLM operations
   - Token usage tracking
   - Error handling and metrics

3. **Instrumented API Routes** (`app/api/chat/route.ts`)
   - Full request lifecycle tracing
   - RAG pipeline instrumentation
   - Vector store operation tracking
   - Conversation flow metrics

4. **Telemetry Initialization** (`app/telemetry-init.ts`)
   - Early initialization of OpenTelemetry
   - Environment-based configuration

## Monitored Operations

### LLM Operations
- **Chat Completions**: Track model inference, token usage, and response times
- **Embeddings**: Monitor document and query embedding operations
- **Streaming Responses**: Observe streaming LLM responses

### RAG Pipeline
- **Question Condensation**: Track standalone question generation
- **Document Retrieval**: Monitor similarity search operations
- **Context Formation**: Measure document combination and context creation
- **Answer Generation**: Track final response generation with context

### Vector Store Operations
- **Initialization**: Track AstraDB vector store setup
- **Similarity Search**: Monitor document retrieval operations
- **Query Processing**: Observe vector search performance

## Observability Outputs

### Jaeger Traces
- **Service Map**: Visualize service dependencies and call flows
- **Request Traces**: Detailed trace of each request with timing information
- **Error Analysis**: Identify bottlenecks and failure points
- **Performance Optimization**: Analyze slow operations and optimize accordingly

### Prometheus Metrics
- **Request Rates**: Monitor requests per second for different operations
- **Response Times**: Track P50, P95, P99 latencies
- **Error Rates**: Monitor failure percentages
- **Token Usage**: Track cost and usage patterns
- **Custom Dashboards**: Create Grafana dashboards for monitoring

## Configuration

### Environment Variables

```bash
# Enable/disable telemetry
ENABLE_TELEMETRY=true

# Jaeger configuration
JAEGER_ENDPOINT=http://localhost:14268/api/traces

# Prometheus configuration
PROMETHEUS_PORT=9090

# Service identification
OTEL_SERVICE_NAME=ragbot-llm-client
OTEL_SERVICE_VERSION=1.0.0
NODE_ENV=development
```

### Telemetry Stack Setup

#### Option 1: Docker Compose (Recommended)
```yaml
version: '3.8'
services:
  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - "16686:16686"
      - "14268:14268"
    environment:
      - COLLECTOR_OTLP_ENABLED=true
  
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
  
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

#### Option 2: Cloud Services
- **Jaeger**: Use Jaeger Cloud or configure your own Jaeger instance
- **Prometheus**: Use Prometheus Cloud or configure your own Prometheus server
- **Grafana**: Use Grafana Cloud for visualization

## Usage Examples

### Starting the Application with Telemetry

```bash
# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Start telemetry stack (if using Docker)
docker-compose up -d jaeger prometheus grafana

# Start the application
npm run dev
```

### Viewing Traces and Metrics

1. **Jaeger UI**: Visit `http://localhost:16686` to view distributed traces
2. **Prometheus Metrics**: Visit `http://localhost:9090/metrics` to see raw metrics
3. **Grafana Dashboards**: Visit `http://localhost:3000` to create custom dashboards

### Sample Metrics

The application exposes these metrics:

```
# Request counters
llm_requests_total{model="gpt-4o-mini-2024-07-18",operation="chat_completion"} 42
embedding_requests_total{model="text-embedding-3-small",operation="embed_query"} 15

# Duration histograms
llm_request_duration_seconds{model="gpt-4o-mini-2024-07-18",status="success"} 1.23
embedding_request_duration_seconds{model="text-embedding-3-small",status="success"} 0.45

# Token usage
llm_tokens_used_total{model="gpt-4o-mini-2024-07-18",type="total"} 1500
llm_tokens_used_total{model="gpt-4o-mini-2024-07-18",type="prompt"} 1000
llm_tokens_used_total{model="gpt-4o-mini-2024-07-18",type="completion"} 500
```

## Troubleshooting

### Common Issues

1. **Telemetry Not Working**
   - Check `ENABLE_TELEMETRY=true` in environment
   - Verify Jaeger and Prometheus endpoints are accessible
   - Check console logs for initialization messages

2. **Missing Traces**
   - Ensure Jaeger is running and accessible
   - Check network connectivity to Jaeger endpoint
   - Verify trace sampling configuration

3. **Missing Metrics**
   - Ensure Prometheus is configured to scrape metrics
   - Check Prometheus targets in the UI
   - Verify metrics port is accessible

### Debug Mode

Enable debug logging by setting:
```bash
OTEL_LOG_LEVEL=debug
```

## Performance Considerations

### Overhead
- **Tracing**: Minimal overhead (~1-2% performance impact)
- **Metrics**: Very low overhead (~0.1% performance impact)
- **Sampling**: Configure sampling rates to reduce overhead in production

### Production Recommendations
- Use sampling to reduce trace volume
- Configure appropriate retention policies
- Monitor telemetry system resource usage
- Use asynchronous exporters for better performance

## Custom Instrumentation

### Adding Custom Metrics

```typescript
import { meter } from '@/services/telemetry';

// Create custom counter
const customCounter = meter.createCounter('custom_operation_total', {
  description: 'Total number of custom operations',
});

// Use in your code
customCounter.add(1, { operation: 'custom_action' });
```

### Adding Custom Traces

```typescript
import { instrumentAsyncOperation } from '@/services/telemetry';

const result = await instrumentAsyncOperation(
  'custom.operation',
  async () => {
    // Your custom operation
    return await performOperation();
  },
  {
    'custom.attribute': 'value',
    'custom.count': 42,
  }
);
```

## Contributing

When adding new LLM operations or modifying existing ones:

1. Add appropriate instrumentation using `instrumentAsyncOperation`
2. Include relevant semantic attributes
3. Update metrics definitions if needed
4. Test telemetry data collection
5. Update documentation

## Security Considerations

- **Data Privacy**: Ensure no sensitive data is included in traces
- **Network Security**: Secure telemetry endpoints with authentication
- **Data Retention**: Configure appropriate retention policies
- **Access Control**: Restrict access to telemetry dashboards

## Support

For issues related to OpenTelemetry instrumentation:
1. Check the official OpenTelemetry documentation
2. Review logs for error messages
3. Verify configuration settings
4. Test with minimal examples

This comprehensive telemetry setup provides full observability into your LLM application, enabling you to monitor performance, optimize costs, and troubleshoot issues effectively.