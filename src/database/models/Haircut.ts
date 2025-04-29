import { SQLiteDatabase } from 'expo-sqlite';

export const createHaircutTable = async (db: SQLiteDatabase) => {
  try {
    // 1. Cria a tabela se não existir
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS haircut (
        id INTEGER PRIMARY KEY AUTOINCREMENT ,
        name TEXT (100) NOT NULL,
        price REAL NOT NULL,
        id_Barber INTEGER NOT NULL,
        FOREIGN KEY (id_Barber) REFERENCES barber(id));
    `);

    // 2. Verifica se a tabela está vazia (sem transação manual)
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(id) as count FROM haircut;'
    );

    // 3. Se estiver vazia, insere dados
    if (result && result.count === 0) {
      await db.runAsync(
        'INSERT INTO haircut (name, price, id_Barber) VALUES (?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?);',
        ['Corte Simples', 30.0, 1,
          'Degradê', 40.0, 1,
          'Navalhado', 50.0, 1,
          'Corte Moderno', 35.0, 2,
          'Riscado', 45.0, 2,
          'Undercut', 55.0, 2,
          'Moicano', 32.0, 3,
          'Samurai', 50.0, 3,
          'Buzz Cut', 28.0, 3]
      );
      console.log('Dados iniciais inseridos na tabela haircut');
    }
  } catch (error) {
    console.error("Erro na criação da tabela haircut:", error);
    throw error; // Propaga o erro para debug
  }
};