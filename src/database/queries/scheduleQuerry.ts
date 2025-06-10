import { supabase } from "../supabase";

export interface RawTimeSlot {
  id: number;
  barber_id: number;
  day_of_week: number;
  time_slot: string;
}

export interface TimeSlot extends RawTimeSlot {
  is_available: boolean;
}

export const getDayOfWeekDisponible = async (
  barber_id: number
): Promise<number[]> => {
  try {
    const {data, error} = await supabase
    .from(`barber_schedule`)
    .select(`day_of_week`)
    .eq(`barber_id`, barber_id);

    if (error) throw error;

    return data.map(row => row.day_of_week);
  } catch (error) {
    console.error("Erro ao buscar dias disponíveis:", error);
    return [];
  }
};

export const getAllSlotsTheDay = async (
  barber_id: number,
  day_of_week: number,
  selectedDate: string
): Promise<TimeSlot[]> => {
  try {
    // Buscar todos os slots para o barbeiro e dia da semana
    const {data, error} =  await supabase
    .from(`barber_schedule`)
    .select(`*`)
    .eq(`barber_id`, barber_id)
    .eq(`day_of_week`, day_of_week);

    if (error) throw error;
    
    // Validar disponibilidade de cada slot
    const appointments = await getAppointmentsForDate(barber_id, selectedDate);
    
    // Validar disponibilidade
    const validatedSlots = data.map(slot => {
      const isAvailable = !appointments.some(
        app => app.time_slot === slot.time_slot
      );
      
      return {
        ...slot,
        is_available: isAvailable
      };
    });

    return validatedSlots.filter(slot => slot.is_available);
  } catch (error) {
    console.error("Erro ao buscar slots:", error);
    throw new Error('Erro ao buscar slots: ' + error.message);
  }
}

const getAppointmentsForDate = async (
  barber_id: number, 
  date: string
) => {
  try {
    const { data, error } = await supabase
      .from(`appointment`)
      .select(`time_slot`)
      .eq(`barber_id`, barber_id)
      .eq(`date`, date);

    return error ? [] : data;
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return [];
  }
};