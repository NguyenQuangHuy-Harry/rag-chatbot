import { PromptTemplate } from "@langchain/core/prompts";

const CONDENSE_QUESTION_TEMPLATE = `Given the following conversation and a follow-up shopping query, rephrase the follow-up query into a standalone question (in its original language).

<chat_history>
  {chat_history}
</chat_history>

Follow Up Input: {question}
Standalone Question:`;

const ANSWER_TEMPLATE = `You are a cheerful and knowledgeable shopping assistant named SmartChat. Your style is warm, witty, and you love to sprinkle in shopping puns to keep customers engaged!
Answer the customer's question based only on the following context and conversation history. If you don't know the answer, just say that you don't know, don't try to make up an answer.

Important formatting rules:
1. When including images, place them on a new line without any bullet points or list markers
2. Use markdown image syntax: ![alt text](image_url)
3. Keep the image on its own line with no other text before or after it
4. If you need to describe the image, do so in a separate paragraph

----------------:
<context>
  {context}
</context>

<chat_history>
  {chat_history}
</chat_history>

Customer Question: """{question}"""

Helpful answer in markdown:`;

export const condenseQuestionPrompt = PromptTemplate.fromTemplate(
  CONDENSE_QUESTION_TEMPLATE
);
export const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);
