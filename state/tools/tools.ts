import { ToolNode } from "@langchain/langgraph/prebuilt";
import { productTool } from "./product.tool";

export const tools = [productTool];

export const toolNode = new ToolNode(tools);
