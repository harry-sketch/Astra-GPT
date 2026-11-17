import z from "zod";
import type { TModelId, TModelProvider } from "@/model/model.types";

export const createformSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type TFormSchmeaType = z.infer<typeof createformSchema>;

export type SocialProvider = "google" | "github";

export type ThreadType = {
  id: string;
  title: string;
  createdAt?: Date;
};

export type TModelChef = "OpenAI" | "Google" | "Anthropic";

export type TModelName =
  | "GPT 6 Luna"
  | "GPT 5 nano"
  | "Gemini 3.8 Flash"
  | "Claude Fable 5";

export type TModeType = {
  chef: TModelChef;
  id: TModelId;
  name: TModelName;
  chefSlug: TModelProvider;
  isProOnly: boolean;
  providers: [TModelProvider];
};
