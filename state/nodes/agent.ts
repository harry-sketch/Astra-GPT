import { SystemMessage } from "@langchain/core/messages";
import type { GraphNode } from "@langchain/langgraph";
import { getDynamicModel } from "../../model/model";
import type { MessagesState } from "../state";

export const callAgent: GraphNode<typeof MessagesState> = async (state) => {
  const model = getDynamicModel("gpt-6-luna");

  const response = await model.invoke([
    new SystemMessage("You are a helpful assistant."),
    ...state.messages,
  ]);
  return {
    messages: [response],
  };
};
