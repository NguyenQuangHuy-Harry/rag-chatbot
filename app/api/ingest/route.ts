import { AstraDBVectorStore } from "@langchain/community/vectorstores/astradb";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { astraDBConfigs, openAIEmbeddings } from "..";

const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
  chunkSize: 512,
  chunkOverlap: 100,
});

export async function POST(req: Request) {
  try {
    const pageflyPagesUrl = [
      "https://help.pagefly.io/manual/all-about-issues-of-using-shopify-themes-for-pagefly-pages/",
      "https://help.pagefly.io/manual/cart-drawer-does-not-automatically-update/",
    ];
    const trainingData = [];

    const splitDocuments = await splitter.splitDocuments(trainingData);

    await AstraDBVectorStore.fromDocuments(splitDocuments, openAIEmbeddings, {
      ...astraDBConfigs,
      collectionOptions: {
        vector: {
          dimension: 1536,
          metric: "cosine",
        },
      },
    });

    return { success: true };
  } catch (e) {
    throw e;
  }
}
