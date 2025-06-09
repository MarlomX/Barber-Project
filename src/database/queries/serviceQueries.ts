import { SQLiteDatabase } from 'expo-sqlite';

export interface Service {
    id: number;
    name: string;
    price: number;
    duration: number;
    barber_id: number;
}

export const getServicesForBarbeId = async (
    db: SQLiteDatabase,
    barber_id: number
): Promise<Service[]> => {
    try {
        const result = await db.getAllAsync<Service>(`
            SELECT 
                s.id, 
                s.name, 
                bs.price, 
                bs.duration, 
                bs.barber_id 
            FROM 
                service s 
            INNER JOIN 
                barber_service bs 
                ON s.id = bs.service_id 
            WHERE 
                bs.barber_id = ?;
        `, [barber_id]);

        return result || [];
    } catch (error) {
        throw new Error('Erro ao buscar os serviços do barbeiro: ' + error.message);
    }
}

export const getServiceById = async (
    db: SQLiteDatabase,
    service_id: number
): Promise<Service | undefined> => {
    try {
        const result = await db.getFirstAsync<Service>(`
            SELECT 
                s.id, 
                s.name, 
                bs.price, 
                bs.duration,
                bs.barber_id 
            FROM 
                service s 
            INNER JOIN 
                barber_service bs
                ON s.id = bs.service_id
            WHERE 
                s.id = ?;
        `, [service_id]);

        return result;
    } catch (error) {
        throw new Error('Erro ao buscar um serviço: ' + error.message);
    }
}