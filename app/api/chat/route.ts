import { HumanMessage } from "@langchain/core/messages";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { app } from "@/state/workflow";
import { threads } from "@/db/schema/chat-schema";
import { eq } from "drizzle-orm";
import { getAuth } from "@/action";

export async function POST(req: Request) {
  const authData = await getAuth();

  const { message, threadId } = await req.json();

  if (!message || !threadId) {
    return NextResponse.json({ message: "Message not found" }, { status: 400 });
  }

  if (!authData?.user) {
    return NextResponse.json(
      { message: "Forbidden, You are not authrorized" },
      { status: 403 },
    );
  }

  const existingThreads = await db
    .select()
    .from(threads)
    .where(eq(threads.id, threadId))
    .limit(1);

  const existingThread = existingThreads[0];

  if (!existingThread) {
    const title = message.trim().slice(0, 30);
    await db.insert(threads).values({
      id: threadId,
      title,
      userId: authData.user.id,
    });
  }

  if (existingThread && existingThread.userId !== authData.user.id) {
    return NextResponse.json(
      { message: "Forbidden, You are not authrorized" },
      { status: 403 },
    );
  }

  const result = app.invoke({
    messages: [new HumanMessage(message)],
  });

  for (const msg of (await result).messages) {
    console.log(`[${msg.type}]: ${msg.text}`);
  }

  return NextResponse.json({ message: "Hello" }, { status: 200 });
}
