import { supabase } from '../supabase';

export interface Barber {
    id: number;
    name: string;
}

export const getAllBarbers = async (
): Promise<Barber[]> => {
    try {
        const {data, error} = await supabase
        .from('barber')
        .select('*');

        if (error) {
            throw error;
        }
        return data || undefined;
    } catch (error) {
        throw new Error('Erro ao buscar todos os barbeiros: ' + error.message);
    }
}

export const getBarberById = async (
    id: number
): Promise<Barber | undefined> => {
    try {
        const {data, error} = await supabase
        .from('barber')
        .select('*')
        .eq('id', id)
        .single();
        
         if (error && error.code !== 'PGRST116') {
            throw error;
        }

        return data || undefined;
    } catch (error) {
        throw new Error('Erro ao buscar um barbeiro: ' + error.message);
    }
}