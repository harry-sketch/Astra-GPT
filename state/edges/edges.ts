import type { AIMessage } from "@langchain/core/messages";
import type { MessagesState } from "../state";

export const shouldContinue = (state: typeof MessagesState.State) => {
  const aiMsg = state.messages.at(-1) as AIMessage;

  const toolCall = aiMsg?.tool_calls?.[0];

  if (toolCall) {
    return "tool-node";
  }
  return "end";
};

export const routeFromStart = () => {
  return ["call-agent", "memory-node"];
};
