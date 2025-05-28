import { SQLiteDatabase } from 'expo-sqlite';

export const createServiceTable = async (db: SQLiteDatabase) => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS service (
        id INTEGER PRIMARY KEY AUTOINCREMENT ,
        name TEXT (100) NOT NULL
        );
    `);
  console.log("Tabela service criada");
  } catch (error) {
    console.error("Erro na criação da tabela service:", error);
    throw error; // Propaga o erro para debug
  }
};

export const populateServiceTable = async(db: SQLiteDatabase) => {
  try{
    await db.runAsync(
      `INSERT INTO service (name) VALUES (?), (?), (?), (?), (?), (?), (?), (?)`,
      ['Corte Social', "Corte Degradê",
        "Corte Militar", "Corte Pompadour", 
        "Corte Undercut", "Barba Completa com Design",
         "Barba Lenhador", "Barba Express"
      ]
    );
  console.log("Tabela service populada");
  } catch(error) {
    console.error("Erro ao popular service");
    throw error;
  }
};