import { START, StateGraph, END } from "@langchain/langgraph";
import { callAgent } from "./nodes/agent";
import { MessagesState } from "./state";
import { checkpointer } from "./memory/memory";
import { toolNode } from "./tools/tools";
import { routeFromStart, shouldContinue } from "./edges/edges";
import { memoryNode } from "./nodes/memoryNode";
import { getStore } from "../lib/store";

export const store = await getStore();

const graph = new StateGraph(MessagesState)
  .addNode("call-agent", callAgent)
  .addNode("tool-node", toolNode)
  .addNode("memory-node", memoryNode)
  .addConditionalEdges(START, routeFromStart, {
    "call-agent": "call-agent",
    "memory-node": "memory-node",
  })
  .addEdge("memory-node", END)
  .addConditionalEdges("call-agent", shouldContinue, {
    "tool-node": "tool-node",
    end: END,
  })
  .addEdge("call-agent", END);

export const app = graph.compile({ checkpointer, store });
