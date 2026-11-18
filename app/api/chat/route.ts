import { toUIMessageStream } from "@ai-sdk/langchain";
import { HumanMessage } from "@langchain/core/messages";
import { createUIMessageStreamResponse } from "ai";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuth } from "@/action";
import { db } from "@/db";
import { threads } from "@/db/schema/chat-schema";
import type { TModelId } from "@/model/model.types";
import { app } from "@/state/workflow";
import { getStateExternalCustomers } from "@polar-sh/sdk/2026-10/services/customers";
import { pClient } from "../../../polar/polar";
import { MODEL_REGISTRY } from "../../../model/model";

export async function POST(req: Request) {
  try {
    const authData = await getAuth();

    const { message, threadId, selectedModel } = await req.json();

    if (!message || !threadId || !selectedModel) {
      return NextResponse.json(
        { message: "Message not found" },
        { status: 400 },
      );
    }

    if (!authData?.user) {
      return NextResponse.json(
        { message: "Forbidden, You are not authorized" },
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
        { message: "Forbidden, You are not authorized" },
        { status: 403 },
      );
    }

    try {
      const modelToBeUsed = MODEL_REGISTRY[selectedModel as TModelId];

      if (modelToBeUsed.tier === "PAID") {
        const customerState = await getStateExternalCustomers(pClient)(
          authData.user.id,
        );
        const hasPro = customerState.active_subscriptions.length > 0;

        if (!hasPro) {
          return NextResponse.json(
            { message: "This model needs a subscription" },
            { status: 403 },
          );
        }
      }
    } catch (error) {
      console.log("erx", error);
      return NextResponse.json(
        { message: "This model needs a subscription" },
        { status: 403 },
      );
    }

    const stream = await app.stream(
      { messages: [new HumanMessage(message)] },
      {
        streamMode: ["values", "messages"],
        configurable: { thread_id: threadId },
        context: {
          userId: authData.user.id,
          selectedModel: selectedModel as TModelId,
        },
      },
    );

    return createUIMessageStreamResponse({
      stream: toUIMessageStream(stream),
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Bad Request", error },
      { status: 403 },
    );
  }
}
