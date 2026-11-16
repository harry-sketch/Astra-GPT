import { START, StateGraph, END } from "@langchain/langgraph";
import { callAgent } from "./nodes/agent";
import { MessagesState } from "./state";
import { checkpointer } from "./memory/memory";
import { toolNode } from "./tools/tools";
import { shouldContinue } from "./edges/edges";

const graph = new StateGraph(MessagesState)
  .addNode("call-agent", callAgent)
  .addNode("tool-node", toolNode)
  .addEdge(START, "call-agent")
  .addConditionalEdges("call-agent", shouldContinue, {
    "tool-node": "tool-node",
    end: END,
  })
  .addEdge("call-agent", END);

export const app = graph.compile({ checkpointer });
