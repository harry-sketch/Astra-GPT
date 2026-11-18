import { PostgresStore } from "@langchain/langgraph-checkpoint-postgres/store";
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  apiKey: process.env.OPENAI_API_KEY!,
});

export const store = PostgresStore.fromConnString(process.env.DATABASE_URL!, {
  index: {
    dims: 1536,
    embed: embeddings,
  },
});

let isSetupDone = false;

export const getStore = async () => {
  if (!isSetupDone) {
    await store.setup();
    isSetupDone = true;
  }

  return store;
};
