import { SystemMessage } from "@langchain/core/messages";
import type { GraphNode } from "@langchain/langgraph";
import { llm } from "@/llm/openai.model";
import type { MessagesState } from "../state";

export const callAgent: GraphNode<typeof MessagesState> = async (state) => {
  const response = await llm.invoke([
    new SystemMessage("You are a helpful assistant."),
    ...state.messages,
  ]);
  return {
    messages: [response],
  };
};
