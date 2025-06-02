import { SQLiteDatabase } from 'expo-sqlite';

export const createBarberServiceTable = async (db: SQLiteDatabase) => {
  try {
    // 1. Cria a tabela se não existir
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS barber_service (
        barber_id INTEGER NOT NULL,
        service_id INTEGER NOT NULL,
        price REAL NOT NULL,
        duration INTEGER DEFAULT 20, -- Duração fixa em minutos
        PRIMARY KEY (barber_id, service_id),
        FOREIGN KEY (barber_id) REFERENCES barber(id),
        FOREIGN KEY (service_id) REFERENCES service(id)
      );
    `);
   console.log("Tabela barber_service criada");
  } catch (error) {
    console.error("Erro na criação da tabela barber_service:", error);
  }
};

export const populateBarberServiceTable = async(db: SQLiteDatabase) => {
  try{
    await db.runAsync(
      `INSERT INTO barber_service (barber_id, service_id, price) VALUES
       (?, ?, ?), (?, ?, ?), (?, ?, ?), (?, ?, ?), 
       (?, ?, ?), (?, ?, ?), (?, ?, ?), (?, ?, ?),
       (?, ?, ?), (?, ?, ?), (?, ?, ?), (?, ?, ?)`,
      [
        // Barbeiro 1 (João Silva) - 4 serviços
        1, 1, 35.00, // Corte Social (1h)
        1, 3, 40.00, // Corte Militar (1h)
        1, 5, 50.00, // Corte Undercut (2h)
        1, 8, 25.00, // Barba Express (30min)

        // Barbeiro 2 (Pedro Andrade) - 5 serviços
        2, 2, 45.00, // Corte Degradê (1h30)
        2, 4, 55.00, // Corte Pompadour (2h)
        2, 6, 60.00, // Barba Completa (1h30)
        2, 7, 35.00, // Barba Lenhador (1h)
        2, 8, 30.00, // Barba Express (30min)

        // Barbeiro 3 (Marcelo Ferreira) - 4 serviços
        3, 3, 40.00, // Corte Militar (1h)
        3, 4, 60.00, // Corte Pompadour (2h)
        3, 5, 55.00, // Corte Undercut (1h30)
        3, 7, 45.00 // Barba Lenhador (1h)
      ]
    );
  console.log("Tabela barber_service populada");
  } catch(error) {
    console.error("Erro ao popular barber_service");
    throw error;
  }
};