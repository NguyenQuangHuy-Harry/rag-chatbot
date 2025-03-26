import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";

const { OPENAI_API_KEY } = process.env;

export const openAIModel = new ChatOpenAI({
  model: "gpt-4o-mini-2024-07-18",
  temperature: 0.2,
  streaming: true,
});

export const openAIEmbeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  apiKey: OPENAI_API_KEY,
  dimensions: 1536,
});
