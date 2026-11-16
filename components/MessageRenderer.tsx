import type { UIMessage } from "ai";
import { Fragment } from "react/jsx-runtime";
import { ConversationScrollButton } from "./ai-elements/conversation";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "./ai-elements/message";
import { CopyIcon, RefreshCcwIcon } from "lucide-react";
import { ProductCarousel } from "./gen-ui/ProductCarousel";

interface Props {
  messages: UIMessage[];
}

const MessageRenderer: React.FC<Props> = ({ messages }) => {
  return (
    <>
      {messages.map((message, messageIndex) => (
        <Fragment key={message.id}>
          {message.parts.map((part, i) => {
            switch (part.type) {
              case "text": {
                const isLastMessage = messageIndex === messages.length - 1;
                return (
                  <Fragment key={`${message.id}-${i}`}>
                    <Message from={message.role} className="text-white">
                      <MessageContent className="text-white">
                        <MessageResponse>{part.text}</MessageResponse>
                      </MessageContent>
                    </Message>
                    {message.role === "assistant" && isLastMessage && (
                      <MessageActions>
                        <MessageAction onClick={() => {}} label="Retry">
                          <RefreshCcwIcon className="size-3" />
                        </MessageAction>
                        <MessageAction
                          onClick={() =>
                            navigator.clipboard.writeText(part.text)
                          }
                          label="Copy"
                        >
                          <CopyIcon className="size-3" />
                        </MessageAction>
                      </MessageActions>
                    )}
                  </Fragment>
                );
              }

              case "dynamic-tool":
                switch (part.toolName) {
                  case "display_products": {
                    if (part.state === "output-available") {
                      const output = part.output as any;

                      const toolContent =
                        typeof output === "string"
                          ? JSON.parse(output)
                          : output?.kwargs?.content
                            ? JSON.parse(output.kwargs.content)
                            : output;
                      return (
                        <div key={`${part.toolCallId}-${i}`}>
                          <ProductCarousel
                            query={toolContent.query}
                            products={toolContent.products}
                          />
                        </div>
                      );
                    }

                    return null;
                  }

                  default:
                    return null;
                }

              default:
                return null;
            }
          })}
        </Fragment>
      ))}
      <ConversationScrollButton />
    </>
  );
};

export default MessageRenderer;
