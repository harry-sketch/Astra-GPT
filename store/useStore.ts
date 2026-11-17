import { Chat, type UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { TModelId } from "../model/model.types";

interface IChat {
  chat: Chat<UIMessage>;
  selectedModel: TModelId;
  setSelectedModel: (modelId: TModelId) => void;
}

const createChatInstance = () => {
  return new Chat<UIMessage>({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({ messages, body }) => {
        const lastMsg = messages.at(-1);
        let lastText = "";
        if (lastMsg && lastMsg.parts[0].type === "text") {
          lastText = lastMsg.parts[0].text;
        }

        return {
          body: {
            message: lastText.trim(),
            threadId: body?.threadId,
            selectedModel: body?.selectedModel,
          },
        };
      },
    }),
  });
};

export const useStore = create<IChat>()(
  devtools((set) => ({
    selectedModel: "gpt-6-luna",
    setSelectedModel: (modelId: TModelId) => set({ selectedModel: modelId }),
    chat: createChatInstance(),
  })),
);
