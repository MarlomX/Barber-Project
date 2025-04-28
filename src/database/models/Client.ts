import { SQLiteDatabase } from 'expo-sqlite';

//Criar a tabela client no banco de dados caso não exista
export const createClientTable = async (db: SQLiteDatabase) => {
  try {
    await db.runAsync(
      `CREATE TABLE IF NOT EXISTS client (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );`,
      []
    );
    console.log("Tabela client criada");
  } catch (error) {
    console.error("Erro na criação da tabela client:", error);
  }
};