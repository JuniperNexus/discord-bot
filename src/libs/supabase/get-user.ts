import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../../services/supabase';
import { Tables } from '../../types/Supabase/DatabaseGenerated';

export const getUser = async (
    userId: string,
): Promise<{ data: Tables<'User'> | null; error: PostgrestError | null }> => {
    const { data, error } = await supabase.from('User').select('*').eq('user_id', userId).single();

    return { data, error };
};
