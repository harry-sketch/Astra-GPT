import { HumanMessage } from "@langchain/core/messages";
import { NextResponse } from "next/server";
import { app } from "@/state/workflow";

export async function POST() {
  const result = app.invoke({
    messages: [new HumanMessage("Hello How are you?")],
  });

  for (const msg of (await result).messages) {
    console.log(`[${msg.type}]: ${msg.text}`);
  }

  return NextResponse.json({ message: "Hello" }, { status: 200 });
}
