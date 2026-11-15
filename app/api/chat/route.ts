import { HumanMessage } from "@langchain/core/messages";
import { NextResponse } from "next/server";
import { app } from "@/state/workflow";

export async function POST(req: Request) {
  const { message } = await req.json();

  if (!message) {
    return NextResponse.json({ message: "Message not found" }, { status: 400 });
  }

  const result = app.invoke({
    messages: [new HumanMessage(message)],
  });

  for (const msg of (await result).messages) {
    console.log(`[${msg.type}]: ${msg.text}`);
  }

  return NextResponse.json({ message: "Hello" }, { status: 200 });
}
