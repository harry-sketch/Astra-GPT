export type TModelProvider = "google" | "anthropic" | "open-ai";
export type TTier = "FREE" | "PAID";
export type TReasoningEffort =
  | "none"
  | "xhigh"
  | "max"
  | "low"
  | "high"
  | "minimal";

export type TModelId =
  | "gpt-6-luna"
  | "gpt-4.1-nano"
  | "gpt-5.4-nano"
  | "gemini-3.8-flash"
  | "claude-fable-5-2";

export interface IModelConfig {
  provider: TModelProvider;
  tier: TTier;
  options?: Record<string, unknown>;
}

export type TModelRegistry = Record<TModelId, IModelConfig>;
