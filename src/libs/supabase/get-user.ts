import { supabase } from '../../services/supabase';

export const getUser = async (userId: string) => {
    const { data } = await supabase.from('users').select('*').eq('user_id', userId).single();

    return { data };
};
