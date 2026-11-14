import { ChatOpenAI } from "@langchain/openai";

export const llm = new ChatOpenAI({
  model: "gpt-6-luna",
  temperature: 0,
  maxTokens: 800,
  maxRetries: 6,
  apiKey: process.env.OPENAI_API_KEY,
  reasoning: {
    effort: "none",
  },
});
