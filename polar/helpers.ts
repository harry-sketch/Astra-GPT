import { ingestEvents } from "@polar-sh/sdk/2026-10/services/events";
import type { TModelId } from "../model/mode.types";
import { pClient } from "./polar";

export const ingestEventsToPolar = async ({
  userId,
  model,
  inputTokens,
  outputTokens,
  totalTokens,
}: {
  userId: string;
  model: TModelId;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}) => {
  try {
    const result = await ingestEvents(pClient)({
      events: [
        {
          name: "llm_tokens",
          external_customer_id: userId,
          metadata: {
            model,
            inputTokens,
            outputTokens,
            total_tokens: totalTokens,
          },
        },
      ],
    });

    console.log("Polar ingestion response:", result);

    return result;
  } catch (error) {
    console.error("Polar ingestion failed:", error);
    throw error;
  }
};
