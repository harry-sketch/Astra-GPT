import { SystemMessage } from "@langchain/core/messages";
import type { GraphNode } from "@langchain/langgraph";
import { getDynamicModel } from "@/model/model";
import { BASE_SYSTEM_PROMPT_TEMPLATE } from "@/prompts";
import type { MessagesState } from "@/state/state";
import { tools } from "@/state/tools/tools";
import { waitUntil } from "@vercel/functions";
import { ingestEventsToPolar } from "../../action";

export const callAgent: GraphNode<typeof MessagesState> = async (
  state,
  runtime,
) => {
  const selectedModel = runtime.context?.selectedModel;

  const userId = runtime.context?.userId;

  const model = getDynamicModel(selectedModel);

  const modeWithTools = model.bindTools(tools);

  const response = await modeWithTools.invoke([
    new SystemMessage(BASE_SYSTEM_PROMPT_TEMPLATE),
    ...state.messages,
  ]);

  waitUntil(
    (async () => {
      try {
        await ingestEventsToPolar({
          userId,
          model: selectedModel,
          inputTokens: response.usage_metadata?.input_tokens ?? 0,
          outputTokens: response.usage_metadata?.output_tokens ?? 0,
          totalTokens: response.usage_metadata?.total_tokens ?? 0,
        });
      } catch (error) {
        console.log("errro in poler ingest events", error);
      }
    })(),
  );

  return {
    messages: [response],
  };
};
