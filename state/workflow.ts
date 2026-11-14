import { END, START, StateGraph } from "@langchain/langgraph";
import { callAgent } from "./nodes/agent";
import { MessagesState } from "./state";

const graph = new StateGraph(MessagesState)
  .addNode("call-agent", callAgent)
  .addEdge(START, "call-agent")
  .addEdge("call-agent", END);

export const app = graph.compile();
