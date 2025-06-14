import { supabase } from "../supabase"; 

export interface Appointment {
    id: number;
    barber_id: number;
    client_id: number;
    service_id: number;
    schedule_id: number;
    date: string;           // Formato: 'YYYY-MM-DD'
    time_slot: string;
}

export const createAppointment = async (
    barber_id: number,
    client_id: number,
    service_id: number,
    schedule_id: number,
    date: string,
    time_slot: string
): Promise<Appointment>  => {
    try {
        const {data, error} = await supabase
        .from(`appointment`)
        .insert([{
            barber_id, 
            client_id, 
            service_id, 
            schedule_id, 
            date, 
            time_slot
        }])
        .select(`*`)
        .single();

        if (error) throw error;
        if (!data) throw new Error('Nenhum dado retornado ao criar agendamento');
        
        return data;
    } catch (error) {
        throw new Error('Erro ao criar agendamento: ' + error.message);
    }
}

export const appointmentsByClientId = async (
    client_id: number
): Promise<Appointment[]> => {
    try {
        const {data, error} = await supabase
        .from(`appointment`)
        .select(`*`)
        .eq(`client_id`, client_id)
        .order(`date`)
        .order(`time_slot`);

        if (error) throw error;
        return data;
    } catch (error) {
        throw new Error('Erro ao buscar agendamentos: ' + error.message);
    }
}