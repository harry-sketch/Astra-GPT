"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "../db";
import { threads } from "../db/schema/chat-schema";
import { desc, eq } from "drizzle-orm";

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
      .select()
      .from(threads)
      .where(eq(threads.userId, authData.user.id))
      .orderBy(desc(threads.createdAt));

    return threadsArr;
  } catch (error) {
    console.log("Error in fetching threads", error);
  }
};
