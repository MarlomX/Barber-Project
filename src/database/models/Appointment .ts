import { SQLiteDatabase } from 'expo-sqlite';

export const createAppointmentTable = async (db: SQLiteDatabase) => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS appointment  (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        barber_id INTEGER NOT NULL,
        client_id INTEGER NOT NULL,
        service_id INTEGER NOT NULL,
        schedule_id INTEGER NOT NULL,
        date TEXT NOT NULL,           -- Formato 'YYYY-MM-DD'
        time_slot TEXT NOT NULL,      -- Horário no formato 'HH:MM'
        FOREIGN KEY (barber_id) REFERENCES barber(id),
        FOREIGN KEY (client_id) REFERENCES client(id),
        FOREIGN KEY (service_id) REFERENCES service(id),
        FOREIGN KEY (schedule_id) REFERENCES barber_schedule(id)
      );
    `);
    console.log("Tabela appointment  criada");
  } catch (error) {
    console.error("Erro na criação da tabela appointment :", error);
    throw error;
  }
};