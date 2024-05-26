import { supabase } from '../../services/supabase';
import { logger } from '../../utils';

export const getUser = async (userId: string) => {
    try {
        const { data } = await supabase.from('users').select('*').eq('user_id', userId).single();

        return { data };
    } catch (error) {
        logger.error('Error fetching user:', error);
        return { data: null, error };
    }
};
