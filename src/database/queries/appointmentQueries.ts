import { SQLiteDatabase } from 'expo-sqlite';

export interface Appointment {
    id: number,
    barber_id: number,
    client_id: number,
    service_id: number,
    schedule_id: number,
    date: string,           //'YYYY-MM-DD'
    time_slot: string,
}

export const createAppointment  = async(
    db: SQLiteDatabase,
    barber_id : number,
    client_id: number,
    service_id: number,
    schedule_id: number,
    date: string,
    time_slot: string,
): Promise<void> => {
    try{
        const result = await db.runAsync(
            `INSERT INTO appointment (barber_id, client_id, service_id, schedule_id, date, time_slot) VALUES (?, ?, ?, ?, ?);`,
            [barber_id, client_id, service_id, schedule_id, date, time_slot]
        );
        console.log(`Agendamento criado: Barber_id: ${barber_id} Client_id : ${client_id} Service_id : ${service_id} Schedule_id : ${schedule_id} Date : ${date} Time_slot : ${time_slot}`);
    } catch (error) {
        throw new Error('Erro ao criar um Servico: ' + error.message);
    }
}