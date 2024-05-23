import { supabase } from '../../services/supabase';

export const getEvent = async (eventName: string) => {
    const { data, error } = await supabase.from('events').select('*').eq('event_name', eventName).single();

    return { data, error };
};

export const getEvents = async () => {
    const { data, error } = await supabase.from('events').select('*');

    return { data, error };
};
