import { SQLiteDatabase } from 'expo-sqlite';

export interface Barber {
    id: number;
    name: string;
}

export const getAllBarbers = async (
    db: SQLiteDatabase
): Promise<Barber[]> => {
    try {
        const result = await db.getAllAsync<Barber>(
            'SELECT id, name FROM barber;'
        );
        return result || [];
    } catch (error) {
        throw new Error('Erro ao buscar todos os barbeiros: ' + error.message);
    }
}

export const getBarberById = async (
    db: SQLiteDatabase,
    id: number
): Promise<Barber | undefined> => {
    try {
        const result = await db.getFirstAsync<Barber>(
            'SELECT id, name FROM barber WHERE id = ?;',
            [id]
        );
        return result;
    } catch (error) {
        throw new Error('Erro ao buscar um barbeiro: ' + error.message);
    }
}