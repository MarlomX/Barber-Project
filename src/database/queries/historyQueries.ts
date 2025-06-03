import { SQLiteDatabase } from 'expo-sqlite';
import {Appointment,appointmentsForClientId} from './appointmentQueries'
import {Barber, getBarberForId} from './barberQueries'
import { Service, getServiceForId } from './serviceQueries';

export interface HistoryInterface {
    date: string,
    time: string,
    barber: string,
    service: string,
    price: string,
}

export const getHistoryforClientId = async(
    db: SQLiteDatabase,
    client_id: number,
): Promise<HistoryInterface[]> => {
    try{
        const historyList: HistoryInterface[] = [];
         const appointments = await appointmentsForClientId(db, client_id) ;

        for (const appointment of appointments) {
            const barber = await getBarberForId(db, appointment.barber_id);
            const service = await  getServiceForId(db, appointment.service_id);

            // Formatar a data para o formato brasileiro DD/MM/AAAA
            const [year, month, day] = appointment.date.split('-');
            const formattedDate = `${day}/${month}/${year}`;

            const historyItem: HistoryInterface = {
                date: formattedDate,
                time: appointment.time_slot,
                barber: barber.name,
                service: service.name,
                price: `R$ ${service.price.toFixed(2).replace('.', ',')}`
            };

            historyList.push(historyItem);
        }
        return historyList;
    }catch (error) {
        throw new Error('Erro ao buscar o hístorico do client: ' + error.message);console.error("Erro na validação:", error);
    }
}