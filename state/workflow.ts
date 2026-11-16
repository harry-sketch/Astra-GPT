import { START, StateGraph, END } from "@langchain/langgraph";
import { callAgent } from "./nodes/agent";
import { MessagesState } from "./state";
import { checkpointer } from "./memory/memory";

const graph = new StateGraph(MessagesState)
  .addNode("call-agent", callAgent)
  .addEdge(START, "call-agent")
  .addEdge("call-agent", END);

export const app = graph.compile({ checkpointer });
