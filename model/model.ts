import { ChatAnthropic } from "@langchain/anthropic";
import { ChatGoogle } from "@langchain/google";
import { ChatOpenAI } from "@langchain/openai";
import type { IModelConfig, TModelId, TModelRegistry } from "./model.types";

export const MODEL_REGISTRY: TModelRegistry = {
  "gpt-6-luna": {
    provider: "openai",
    tier: "FREE",
    options: {
      temperature: 0,
      maxTokens: 800,
      maxRetries: 6,
      reasoning: {
        effort: "none",
      },
    },
  },
  "gpt-5.4-nano": {
    provider: "openai",
    tier: "PAID",
    options: {
      maxRetries: 6,
    },
  },
  "gpt-4.1-nano": {
    provider: "openai",
    tier: "PAID",
    options: {
      temperature: 0,
      maxTokens: 800,
    },
  },
  "gemini-3.8-flash": {
    provider: "google",
    tier: "PAID",
    options: {
      maxTokens: 800,
      maxRetries: 6,
    },
  },
  "claude-fable-5-2": {
    provider: "anthropic",
    tier: "PAID",
    options: {
      maxTokens: 800,
      maxRetries: 6,
    },
  },
};

export const getBaseModel = (modelId: TModelId, config: IModelConfig) => {
  const baseModel = { model: modelId, ...config.options };

  if (config.provider === "openai") {
    return new ChatOpenAI({
      ...baseModel,
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  if (config.provider === "google") {
    return new ChatGoogle({
      ...baseModel,
      apiKey: process.env.GOOGLE_API_KEY,
    });
  }

  if (config.provider === "anthropic") {
    return new ChatAnthropic({
      ...baseModel,
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  return getDefaultModel();
};

export const getDynamicModel = (modelId: TModelId) => {
  const config = MODEL_REGISTRY[modelId];

  if (!config) return getDefaultModel();

  return getBaseModel(modelId, config);
};

export const getDefaultModel = () => {
  return new ChatOpenAI({
    model: "gpt-6-luna",
    apiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
    maxTokens: 800,
    maxRetries: 6,
    reasoning: {
      effort: "none",
    },
  });
};
