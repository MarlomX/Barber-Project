import { supabase } from '../supabase';

export interface Service {
    id: number;
    name: string;
    price: number;
    duration: number;
    barber_id: number;
}

export const getServicesForBarberId = async (
    barber_id: number
): Promise<Service[]> => {
    try {
        const {data, error} = await supabase
        .from(`barber_service`)
        .select(`
            id,
            service_id (name),
            price,
            duration,
            barber_id
            `)
            .eq('barber_id', barber_id);

            
        if (error) {
            throw error;
        }

        const services = data.map(item => ({
            id: item.id,
            name: (item.service_id as any).name,
            price: item.price,
            duration: item.duration,
            barber_id: item.barber_id
        }));

        return services || undefined;
    } catch (error) {
        throw new Error('Erro ao buscar os serviços do barbeiro: ' + error.message);
    }
}

export const getServiceById = async (
    id: number
): Promise<Service | undefined> => {
    try {
        const {data, error} = await supabase
            .from('barber_service')
            .select(`
                id,
                service_id (name),
                price,
                duration,
                barber_id
            `)
            .eq(`id`, id)
            .single();
        
        if (error) {
            if (error.code === 'PGRST116') {  // Nenhum resultado encontrado
                return undefined;
            }
            throw error;
        }

        return {
            id: data.id,
            name: (data.service_id as any).name,
            price: data.price,
            duration: data.duration,
            barber_id: data.barber_id
        };

    } catch (error) {
        throw new Error('Erro ao buscar um serviço: ' + error.message);
    }
}