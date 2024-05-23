import { createClient } from '@supabase/supabase-js';
import { env } from '../../config';
import { Database } from '../../types/Supabase/DatabaseGenerated';

export const supabase = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
