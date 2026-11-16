import { tool } from "@langchain/core/tools";
import * as z from "zod";

export const productTool = tool(
  ({ query, location }) => {
    console.log({ query, location });

    return {
      query,
      products: [{ id: "1", name: "Macbook" }],
    };
  },
  {
    name: "display_products",
    description:
      "Search for real e-commerce products and display a carousel of prices and details. Always call this tool whenever user searches for any kind of product.",
    schema: z.object({
      query: z
        .string()
        .describe("The product to search for. e.g., iPhone 17, Macbook Pro"),
      location: z
        .string()
        .optional()
        .describe(
          "The location of the user for query search. Include this field only if user asks it explicitely e.g., `India`",
        ),
    }),
  },
);
