import { supabase } from '../../services/supabase';
import { logger } from '../../utils';

export const getEvent = async (eventName: string) => {
    try {
        const { data, error } = await supabase.from('events').select('*').eq('event_name', eventName).single();

        return { data, error };
    } catch (error) {
        logger.error('Error fetching event:', error);
        return { data: null, error };
    }
};

export const getEvents = async () => {
    try {
        const { data, error } = await supabase.from('events').select('*');

        return { data, error };
    } catch (error) {
        logger.error('Error fetching event:', error);
        return { data: null, error };
    }
};
