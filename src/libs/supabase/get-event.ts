import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../../services/supabase';
import { Tables } from '../../types/Supabase/DatabaseGenerated';

export const getEvents = async (): Promise<{ data: Tables<'Event'>[] | null; error: PostgrestError | null }> => {
    const { data, error } = await supabase.from('Event').select('*');

    return { data, error };
};
