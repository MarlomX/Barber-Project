import { SQLiteDatabase } from 'expo-sqlite';

export interface Haircut{
    id: number,
    name: string,
    price: number,
    id_Barber: number
}

export const getHaircutsForBarbeId = async(
    db: SQLiteDatabase,
    id_Barber: number
): Promise <Haircut[]> => {
    try{
        const result = await db.getAllAsync<Haircut>(
            'SELECT id, name, price, id_Barber FROM haircut WHERE id_Barber = ?;', 
            [id_Barber]
        );
        return result || [];
    } catch(error) {
        throw new Error('Erro ao buscar os cortes do barbeiro: ' + error.message);
    }
}

export const getHaircutForId = async(
    db: SQLiteDatabase,
    id: number
): Promise <Haircut | undefined> => {
    try{
        const result = await db.getFirstAsync<Haircut>(
            'SELECT id, name, price, id_Barber FROM haircut WHERE id = ?;',
            [id]
        );
        return result;
    } catch(error) {
        throw new Error('Erro ao buscar um corte: ' + error.message);
    }
}
