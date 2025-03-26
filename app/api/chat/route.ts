import { astraDBConfigs } from "@/services/astraDB";
import { openAIEmbeddings, openAIModel } from "@/services/openAI";
import { AstraDBVectorStore } from "@langchain/community/vectorstores/astradb";
import type { Document } from "@langchain/core/documents";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import type { Message as VercelChatMessage } from "ai";
import { StreamingTextResponse } from "ai";
import {
  answerPrompt,
  condenseQuestionPrompt,
} from "../../services/openAI/promt-template";

const combineDocumentsFn = (docs: Document[]) => {
  const serializedDocs = docs.map((doc) => doc.pageContent);
  return serializedDocs.join("\n\n");
};

const formatVercelMessages = (chatHistory: VercelChatMessage[]) => {
  const formattedDialogueTurns = chatHistory.map((message) => {
    if (message.role === "user") {
      return `Human: ${message.content}`;
    }
    if (message.role === "assistant") {
      return `Assistant: ${message.content}`;
    }
    return `${message.role}: ${message.content}`;
  });
  return formattedDialogueTurns.join("\n");
};

export async function POST(req: Request) {
  try {
    const { messages, useRag, llm, similarityMetric } = await req.json();

    const latestMessage = messages[messages?.length - 1]?.content;
    const previousMessages = messages.slice(0, -1);

    const vectorstore = await AstraDBVectorStore.fromExistingIndex(
      openAIEmbeddings,
      {
        ...astraDBConfigs,
        skipCollectionProvisioning: true,
      }
    );

    // standaloneQuestionChain: Converts follow-up questions into standalone questions
    // This chain:
    // 1. Takes the chat history and current question
    // 2. Uses condenseQuestionPrompt to rephrase the question without context
    // 3. Runs it through the model to get a standalone question
    // 4. Parses the output as a string
    const standaloneQuestionChain = RunnableSequence.from([
      condenseQuestionPrompt,
      openAIModel,
      new StringOutputParser(),
    ]);

    // Set up the retriever to fetch 10 most relevant documents
    const retriever = vectorstore.asRetriever(10);

    // Combine the retrieved documents into a single context
    const retrievalChain = retriever.pipe(combineDocumentsFn);

    // answerChain: Generates the final response using context and chat history
    // This chain:
    // 1. Takes the standalone question and chat history
    // 2. Retrieves relevant context using retrievalChain
    // 3. Combines context, chat history, and question
    // 4. Uses answerPrompt to format the response
    // 5. Runs it through the model to generate the final answer
    const answerChain = RunnableSequence.from([
      {
        context: RunnableSequence.from([
          (input) => input.question,
          retrievalChain,
        ]),
        chat_history: (input) => input.chat_history,
        question: (input) => input.question,
      },
      answerPrompt,
      openAIModel,
    ]);

    // conversationalRetrievalQAChain: Main chain that combines everything
    // This chain:
    // 1. Takes the original question and chat history
    // 2. Uses standaloneQuestionChain to rephrase the question
    // 3. Passes the rephrased question to answerChain
    // 4. Parses the final response as a string
    const conversationalRetrievalQAChain = RunnableSequence.from([
      {
        question: standaloneQuestionChain,
        chat_history: (input) => input.chat_history,
      },
      answerChain,
      new StringOutputParser(),
    ]);

    // Stream the response using the combined chain
    const stream = await conversationalRetrievalQAChain.stream({
      question: latestMessage,
      chat_history: formatVercelMessages(previousMessages),
    });

    return new StreamingTextResponse(stream);
  } catch (e) {
    throw e;
  }
}
