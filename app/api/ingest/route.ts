import { PAGEFLY_HELP_CENTER_PAGES_URLS } from "@/constants/pagefly-help-center-urls";
import { astraDBConfigs } from "@/services/astraDB";
import { openAIEmbeddings } from "@/services/openAI";
import { AstraDBVectorStore } from "@langchain/community/vectorstores/astradb";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "langchain/document";
import puppeteer, { Browser } from "puppeteer";

const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
  chunkSize: 512,
  chunkOverlap: 100,
});

// Separate function to scrape a single page
async function scrapeSinglePage(
  url: string,
  browser: Browser
): Promise<Document | null> {
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Extract title and content from the page
    const title = await page.title();

    // Target the main content area of the help center page
    const content = await page.evaluate(() => {
      const article =
        document.querySelector(".article") ||
        document.querySelector("#article__content");
      if (!article) return "";

      const unwantedTags = article.querySelectorAll(
        "header, footer, nav, .sidebar, .advertisement, script, style"
      );
      unwantedTags.forEach((tag) => tag.remove());

      // Extract text content
      return `This is the content of the page url ${document.URL} ${
        document.title ? "about" + document.title : ""
      }:
  ${article.textContent || ""}`;
    });

    if (content) {
      return new Document({
        pageContent: content,
        metadata: {
          url,
          title,
          source: "pagefly-help-center",
        },
      });
    }

    return null;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return null;
  } finally {
    await page.close();
  }
}

// Process documents in batches
async function processDocumentsInBatches(
  documents: Document[],
  batchSize: number = 10
) {
  // Process documents in batches
  for (let i = 0; i < documents.length; i += batchSize) {
    const batch = documents.slice(i, i + batchSize);

    // Split the batch into chunks
    const splitBatch = await splitter.splitDocuments(batch);

    await AstraDBVectorStore.fromDocuments(splitBatch, openAIEmbeddings, {
      ...astraDBConfigs,
      collectionOptions: {
        vector: {
          dimension: 1536,
          metric: "cosine",
        },
      },
    });

    console.log(
      `Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
        documents.length / batchSize
      )}`
    );
  }

  return { success: true, processedCount: documents.length };
}

export async function POST(req: Request) {
  try {
    const batchSize = 10;
    const maxConcurrent = 5;

    // Launch puppeteer browser
    const browser = await puppeteer.launch({
      headless: true,
      timeout: 10000,
    });

    const allUrls = [...PAGEFLY_HELP_CENTER_PAGES_URLS];
    const documents: Document[] = [];

    // Process URLs in batches to limit concurrent scraping
    for (let i = 0; i < allUrls.length; i += maxConcurrent) {
      const urlBatch = allUrls.slice(i, i + maxConcurrent);

      const batchResults = await Promise.allSettled(
        urlBatch.map((url) => scrapeSinglePage(url, browser))
      );

      // Filter out errors and nulls
      const validDocuments = batchResults
        .filter(
          (result): result is PromiseFulfilledResult<Document> =>
            result.status === "fulfilled" && result.value !== null
        )
        .map((result) => result.value);

      documents.push(...validDocuments);

      console.log(
        `Scraped URLs ${i + 1} to ${Math.min(
          i + maxConcurrent,
          allUrls.length
        )} of ${allUrls.length}`
      );
    }

    await browser.close();

    // Process the documents in batches
    const result = await processDocumentsInBatches(documents, batchSize);
    console.log("Completed scraping and ingestion process.");
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in ingest process:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
