import { SQLiteDatabase } from 'expo-sqlite';

// Defini uma interface Cliente
export interface RawTimeSlot {
  id: number;
  barber_id: number;
  day_of_week: number;
  time_slot: string;
}
export interface TimeSlot extends RawTimeSlot {
  is_available: boolean;
}

export const getDayOfWeekDisponible = async(
    db: SQLiteDatabase,
    barber_id : number
): Promise<number[]> => {
    try{
        const result = await db.getAllAsync<{ day_of_week: number }>(
            `SELECT DISTINCT day_of_week 
             FROM barber_schedule 
             WHERE barber_id = ?;`,
            [barber_id]
        );

        return result.map(row => row.day_of_week);
    } catch (error) {
        console.error("Erro ao buscar dias:", error);
        return [];
    }
};

export const getAllSlotsTheDay = async(
  db: SQLiteDatabase,
  barber_id: number,
  day_of_week: number,
  selectedDate: string
): Promise<TimeSlot[]> => {
  try{
    const result = await db.getAllAsync<TimeSlot>(
      `SELECT id, barber_id, day_of_week, time_slot
       FROM barber_schedule 
       WHERE barber_id = ? 
         AND day_of_week = ?;`, 
      [barber_id, day_of_week]
    ); 
    
    const validatedSlots = await Promise.all(
      result.map(slot => validateSlot(db, slot, selectedDate))
    );
    
    return validatedSlots.filter(slot => slot.is_available);
  } catch (error) {
    throw new Error('Erro ao buscar slots: ' + error.message);
    return [];
  }
}

 const validateSlot = async(
  db: SQLiteDatabase,
  timeSlot: RawTimeSlot,
  currentDate: string
): Promise<TimeSlot> => {
  try {
    const result = await db.getFirstAsync<{ count: number }>(`
      SELECT COUNT(*) as count FROM appointment  
      WHERE barber_id = ? 
        AND date = ? 
        AND time_slot = ?;
    `, [timeSlot.barber_id, currentDate, timeSlot.time_slot]);
    return { 
      ...timeSlot,
      is_available: result?.count === 0
    };

  } catch (error) {
    console.error("Erro na validação:", error);
    return { ...timeSlot, is_available: false };
  }
};