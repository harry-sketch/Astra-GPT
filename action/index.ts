"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "../db";
import { threads } from "../db/schema/chat-schema";
import { and, desc, eq } from "drizzle-orm";
import {
  type BaseMessage,
  mapChatMessagesToStoredMessages,
} from "@langchain/core/messages";
import type { TModelId } from "../model/model.types";
import { pClient } from "../polar/polar";
import { ingestEvents } from "@polar-sh/sdk/2026-10/services/events";

export const getAuth = async () => {
  return auth.api.getSession({
    headers: await headers(),
  });
};

export const fetchThreads = async () => {
  try {
    const authData = await getAuth();

    if (!authData) {
      return [];
    }

    const threadsArr = await db
      .select({
        id: threads.id,
        title: threads.title,
        createdAt: threads.createdAt,
      })
      .from(threads)
      .where(eq(threads.userId, authData.user.id))
      .orderBy(desc(threads.createdAt));

    return threadsArr;
  } catch (error) {
    console.log("Error in fetching threads", error);
  }
};

export const getMessagHistory = async ({
  thread_id,
  graph,
}: {
  thread_id: string;
  graph: any;
}) => {
  try {
    const session = await getAuth();

    if (!session) {
      return [];
    }

    const existingThreads = await db
      .select({
        id: threads.id,
        title: threads.title,
        createdAt: threads.createdAt,
      })
      .from(threads)
      .where(
        and(eq(threads.id, thread_id), eq(threads.userId, session.user.id)),
      )
      .limit(1);

    const isOwner = existingThreads.length > 0;

    if (!isOwner) {
      return [];
    }

    const config = { configurable: { thread_id } };

    const state = await graph.getState(config);

    const messages = (state?.values?.messages as BaseMessage[]) ?? [];

    const modifiedMsgs = mapChatMessagesToStoredMessages(messages);

    return modifiedMsgs;
  } catch (error) {
    console.log("Erorr in fetching single Thread", error);
  }
};

export const ingestEventsToPolar = async ({
  userId,
  model,
  inputTokens,
  outputTokens,
  totalTokens,
}: {
  userId: string;
  model: TModelId;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}) => {
  try {
    const result = await ingestEvents(pClient)({
      events: [
        {
          name: "llm_tokens",
          external_customer_id: userId,
          metadata: {
            model,
            inputTokens,
            outputTokens,
            total_tokens: totalTokens,
          },
        },
      ],
    });

    return result;
  } catch (error) {
    console.error("Polar ingestion failed:", error);
    throw error;
  }
};
