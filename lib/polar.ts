import { createPolarCore } from "@polar-sh/sdk/2026-10";

export const pClient = createPolarCore({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  environment: "sandbox",
});
