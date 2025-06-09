import { SQLiteDatabase } from 'expo-sqlite';

export interface Appointment {
    barber_id: number;
    client_id: number;
    service_id: number;
    schedule_id: number;
    date: string;           // Formato: 'YYYY-MM-DD'
    time_slot: string;
}

export const createAppointment = async (
    db: SQLiteDatabase,
    barber_id: number,
    client_id: number,
    service_id: number,
    schedule_id: number,
    date: string,
    time_slot: string
): Promise<void> => {
    try {
        await db.runAsync(
            `INSERT INTO appointment (
                barber_id, 
                client_id, 
                service_id, 
                schedule_id, 
                date, 
                time_slot
            ) VALUES (?, ?, ?, ?, ?, ?);`,
            [barber_id, client_id, service_id, schedule_id, date, time_slot]
        );
    } catch (error) {
        throw new Error('Erro ao criar agendamento: ' + error.message);
    }
}

export const appointmentsByClientId = async (
    db: SQLiteDatabase,
    client_id: number
): Promise<Appointment[]> => {
    try {
        const result = await db.getAllAsync<Appointment>(
            `SELECT 
                barber_id, 
                client_id, 
                service_id, 
                schedule_id, 
                date, 
                time_slot
            FROM appointment
            WHERE client_id = ?
            ORDER BY date DESC, time_slot DESC;`,
            [client_id]
        );
        return result;
    } catch (error) {
        throw new Error('Erro ao buscar agendamentos: ' + error.message);
    }
}