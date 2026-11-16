import { getMessagHistory } from "@/action";
import { ChatInterface } from "@/components/ChatInterface";
import { app } from "@/state/workflow";

interface Props {
  params: Promise<{
    thread_id: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { thread_id } = await params;

  const messageHistory =
    (await getMessagHistory({ thread_id, graph: app })) ?? [];

  return <ChatInterface messageHistory={messageHistory} />;
}
