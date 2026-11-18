import type { GraphNode } from "@langchain/langgraph";
import type { MessagesState } from "../state";
import { getStore } from "@/lib/store";
import { REMEMBER_MEMORY_PROMPT } from "@/prompts";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { callOpenAIModel } from "@/http/llm";
import { v4 as uuidv4 } from "uuid";

export const memoryNode: GraphNode<typeof MessagesState> = async (
  state,
  runtime,
) => {
  const store = await getStore();

  const userId = runtime.context?.userId;

  if (!userId) {
    console.error("userId required for memory extraction");
    return {};
  }

  const namespace = [userId, "memories"];

  const lastMsg = state.messages.at(-1);

  if (!lastMsg) {
    return {};
  }

  const content = typeof lastMsg.content === "string" ? lastMsg.content : "";

  if (lastMsg.content.length < 5) {
    console.log(`[Memory] Skipping short message (${content.length} chars)`);
    return {};
  }

  const existingItems = await store.search(namespace);

  const existingTexts = existingItems
    .map((it) => it.value.data)
    .filter(Boolean);

  const userDetailsContent =
    existingTexts.length > 0
      ? existingTexts.map((t) => `- ${t}`).join("\n")
      : "(empty)";

  const sysMsg = await REMEMBER_MEMORY_PROMPT.format({
    user_details_content: userDetailsContent,
  });

  const sysmsg = new SystemMessage({ content: sysMsg });
  const usermsgs = [new HumanMessage(`USER MESSAGE:\n${lastMsg.content}`)];

  const memoryDecisionOutput = await callOpenAIModel(usermsgs, sysmsg, true);

  if (!memoryDecisionOutput || typeof memoryDecisionOutput === "string") {
    return {};
  }
  if (memoryDecisionOutput.should_write && memoryDecisionOutput.memories) {
    for (const mem of memoryDecisionOutput.memories) {
      if (mem.is_new) {
        await store.put(namespace, uuidv4(), {
          data: mem.text,
        });
      }
    }
  }

  console.log(
    `memory updated for user ${userId}: ${JSON.stringify(memoryDecisionOutput)}`,
  );

  return {};
};
