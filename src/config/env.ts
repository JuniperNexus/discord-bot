import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production']).default('development'),

    TOKEN: z.string(),
    CLIENT_ID: z.string(),
    GUILD_ID: z.string(),
    OWNER_ID: z.string(),
    JPN_ROLE_ID: z.string(),
    INTERESTED_ROLE_ID: z.string(),

    SUPABASE_URL: z.string(),
    SUPABASE_ANON_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
