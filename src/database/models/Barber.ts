import { SQLiteDatabase } from 'expo-sqlite';

export const createBarberTable = async (db: SQLiteDatabase) => {
  try {
    // 1. Cria a tabela se não existir
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS barber (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );
    `);

    // 2. Verifica se a tabela está vazia (sem transação manual)
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(id) as count FROM barber;'
    );

    // 3. Se estiver vazia, insere dados
    if (result && result.count === 0) {
      await db.runAsync(
        'INSERT INTO barber (name) VALUES (?), (?), (?);',
        ['João Barbeiro', 'Roberto Estilo', 'Felipe Designer']
      );
      console.log('Dados iniciais inseridos na tabela barber');
    }
  } catch (error) {
    console.error("Erro na criação da tabela barber:", error);
    throw error; // Propaga o erro para debug
  }
};