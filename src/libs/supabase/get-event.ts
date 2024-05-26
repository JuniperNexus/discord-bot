import { supabase } from '../../services/supabase';
import { logger } from '../../utils';

export const getEvents = async () => {
    try {
        const { data, error } = await supabase.from('events').select('*');

        return { data, error };
    } catch (error) {
        logger.error('Error fetching event:', error);
        return { data: null, error };
    }
};
