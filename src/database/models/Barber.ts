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
  console.log("Tabela barber criada");
  } catch (error) {
    console.error("Erro na criação da tabela barber:", error);
    throw error; // Propaga o erro para debug
  }
};

export const populateBarberTable = async(db: SQLiteDatabase) => {
  try{
    await db.runAsync(
      `INSERT INTO barber (name) VALUES (?), (?), (?)`,
      ['João Silva', "Pedro Andrade", "Marcelo Ferreira"]
    );
  console.log("Tabela barber populada");
  } catch(error) {
    console.error("Erro ao popular barber");
    throw error;
  }
};