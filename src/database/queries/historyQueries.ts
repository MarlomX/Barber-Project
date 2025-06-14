import { SQLiteDatabase } from 'expo-sqlite';
import { Appointment, appointmentsByClientId } from './appointmentQueries';
import { Barber, getBarberById } from './barberQueries';
import { Service, getServiceById } from './serviceQueries';

export interface HistoryInterface {
    date: string;
    time: string;
    barber: string;
    service: string;
    price: string;
}

export const getHistoryforClientId = async (
    client_id: number
): Promise<HistoryInterface[]> => {
    try {
        const appointments = await appointmentsByClientId(client_id);
        const historyList: HistoryInterface[] = [];

        // Processar cada agendamento em paralelo para melhor desempenho
        await Promise.all(
            appointments.map(async (appointment) => {
                const [barber, service] = await Promise.all([
                    getBarberById(appointment.barber_id),
                    getServiceById(appointment.service_id)
                ]);

                // Formatar a data para o formato brasileiro DD/MM/AAAA
                const [year, month, day] = appointment.date.split('-');
                const formattedDate = `${day}/${month}/${year}`;

                historyList.push({
                    date: formattedDate,
                    time: appointment.time_slot,
                    barber: barber?.name || 'Barbeiro não encontrado',
                    service: service?.name || 'Serviço não encontrado',
                    price: `R$ ${service?.price.toFixed(2).replace('.', ',') || '0,00'}`
                });
            })
        );

        return historyList;
    } catch (error) {
        throw new Error('Erro ao buscar histórico do cliente: ' + error.message);
    }
};