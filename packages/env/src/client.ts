import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const clientEnv = createEnv({
  clientPrefix: "VITE_",

  client: {
    VITE_SUPABASE_URL: z.string().url(),
    VITE_SUPABASE_ANON_KEY: z.string().min(1),
    VITE_APP_NAME: z.string().default("ByteBank"),
    VITE_APP_VERSION: z.string().default("1.0.0"),
    // URLs dos microfrontends para Module Federation
    VITE_AUTH_MFE_URL: z.string().url().optional(),
    VITE_MENU_MFE_URL: z.string().url().optional(),
    // Base URLs para cada app
    VITE_AUTH_BASE_URL: z.string().default("/"),
    VITE_MENU_BASE_URL: z.string().default("/"),
  },

  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
