import { tool } from "@langchain/core/tools";
import { getJson } from "serpapi";
import * as z from "zod";

type ProductFromAPI = {
  product_id: string;
  title: string;
  extracted_price: string;
  description: string;
  rating: number;
  thumbnail: string;
  product_link: string;
};

type Product = {
  id: string;
  title: string;
  price: string;
  description: string;
  rating: number;
  thumbnail: string;
  product_link: string;
};

export const productTool = tool(
  async ({ query, location = "India" }) => {
    try {
      const response = await getJson({
        engine: "google",
        api_key: process.env.SERP_API_KEY,
        q: query,
        location: location,
      });

      if (!response.shopping_results.length) {
        return { query, products: [] };
      }

      const products = response.shopping_results.map(
        (p: ProductFromAPI, index: number): Product => {
          return {
            id: p.product_id || String(index),
            title: p.title,
            description: p.description,
            price: p.extracted_price,
            product_link: `${p.product_link} &utm_source=astrgpt.vercel.com`,
            rating: p.rating,
            thumbnail: p.thumbnail,
          };
        },
      );

      return { query, products };
    } catch (err) {
      console.error("Error fetching the google shopping products", err);
      return {
        query,
        products: [],
      };
    }
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
