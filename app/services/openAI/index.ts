import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { 
  instrumentAsyncOperation, 
  llmRequestCounter, 
  llmRequestDuration, 
  llmTokensUsed,
  embeddingRequestCounter,
  embeddingRequestDuration 
} from "../telemetry";

const { OPENAI_API_KEY } = process.env;

// Create instrumented ChatOpenAI class
class InstrumentedChatOpenAI extends ChatOpenAI {
  private modelName: string;

  constructor(config: any) {
    super(config);
    this.modelName = config.model;
  }

  async _generate(messages: any, options?: any, runManager?: any) {
    return instrumentAsyncOperation(
      'llm.chat_completion',
      async () => {
        const startTime = Date.now();
        
        // Increment request counter
        llmRequestCounter.add(1, {
          model: this.modelName,
          operation: 'chat_completion',
        });

        try {
          const result = await super._generate(messages, options, runManager);
          
          // Record duration
          const duration = (Date.now() - startTime) / 1000;
          llmRequestDuration.record(duration, {
            model: this.modelName,
            operation: 'chat_completion',
            status: 'success',
          });

          // Record token usage if available
          if (result.llmOutput?.tokenUsage) {
            const { totalTokens, promptTokens, completionTokens } = result.llmOutput.tokenUsage;
            llmTokensUsed.add(totalTokens || 0, {
              model: this.modelName,
              type: 'total',
            });
            llmTokensUsed.add(promptTokens || 0, {
              model: this.modelName,
              type: 'prompt',
            });
            llmTokensUsed.add(completionTokens || 0, {
              model: this.modelName,
              type: 'completion',
            });
          }

          return result;
        } catch (error) {
          // Record duration for failed requests
          const duration = (Date.now() - startTime) / 1000;
          llmRequestDuration.record(duration, {
            model: this.modelName,
            operation: 'chat_completion',
            status: 'error',
          });
          throw error;
        }
      },
      {
        'llm.model': this.modelName,
        'llm.operation': 'chat_completion',
        'llm.messages_count': messages.length,
      }
    );
  }
}

// Create instrumented OpenAIEmbeddings class
class InstrumentedOpenAIEmbeddings extends OpenAIEmbeddings {
  private modelName: string;

  constructor(config: any) {
    super(config);
    this.modelName = config.model;
  }

  async embedDocuments(texts: string[]) {
    return instrumentAsyncOperation(
      'llm.embeddings',
      async () => {
        const startTime = Date.now();
        
        // Increment request counter
        embeddingRequestCounter.add(1, {
          model: this.modelName,
          operation: 'embed_documents',
          documents_count: texts.length,
        });

        try {
          const result = await super.embedDocuments(texts);
          
          // Record duration
          const duration = (Date.now() - startTime) / 1000;
          embeddingRequestDuration.record(duration, {
            model: this.modelName,
            operation: 'embed_documents',
            status: 'success',
          });

          return result;
        } catch (error) {
          // Record duration for failed requests
          const duration = (Date.now() - startTime) / 1000;
          embeddingRequestDuration.record(duration, {
            model: this.modelName,
            operation: 'embed_documents',
            status: 'error',
          });
          throw error;
        }
      },
      {
        'llm.model': this.modelName,
        'llm.operation': 'embed_documents',
        'llm.documents_count': texts.length,
        'llm.total_characters': texts.join('').length,
      }
    );
  }

  async embedQuery(text: string) {
    return instrumentAsyncOperation(
      'llm.embed_query',
      async () => {
        const startTime = Date.now();
        
        // Increment request counter
        embeddingRequestCounter.add(1, {
          model: this.modelName,
          operation: 'embed_query',
        });

        try {
          const result = await super.embedQuery(text);
          
          // Record duration
          const duration = (Date.now() - startTime) / 1000;
          embeddingRequestDuration.record(duration, {
            model: this.modelName,
            operation: 'embed_query',
            status: 'success',
          });

          return result;
        } catch (error) {
          // Record duration for failed requests
          const duration = (Date.now() - startTime) / 1000;
          embeddingRequestDuration.record(duration, {
            model: this.modelName,
            operation: 'embed_query',
            status: 'error',
          });
          throw error;
        }
      },
      {
        'llm.model': this.modelName,
        'llm.operation': 'embed_query',
        'llm.query_length': text.length,
      }
    );
  }
}

export const openAIModel = new InstrumentedChatOpenAI({
  model: "gpt-4o-mini-2024-07-18",
  temperature: 0.2,
  streaming: true,
});

export const openAIEmbeddings = new InstrumentedOpenAIEmbeddings({
  model: "text-embedding-3-small",
  apiKey: OPENAI_API_KEY,
  dimensions: 1536,
});
