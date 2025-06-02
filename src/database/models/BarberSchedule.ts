import { SQLiteDatabase } from 'expo-sqlite';

export const createBarberScheduleTable = async (db: SQLiteDatabase) => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS barber_schedule (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        barber_id INTEGER NOT NULL,
        day_of_week INTEGER NOT NULL, -- 0=Domingo, 1=Segunda, ..., 6=Sábado
        time_slot TEXT NOT NULL,      -- Horário no formato 'HH:MM'
        FOREIGN KEY (barber_id) REFERENCES barber(id)
      );
    `);
    console.log("Tabela barber_schedule criada");
  } catch (error) {
    console.error("Erro na criação da tabela barber_schedule:", error);
    throw error;
  }
};

export const populateBarberSchedule = async (db: SQLiteDatabase) => {
  try {
    
    // Configuração personalizada para cada barbeiro
    const barberConfig = [
  {
    id: 1,
    workingDays: [1, 3, 4, 5], // Segunda(1), Quarta(3), Quinta(4), Sexta(5)
    dailyStart: '08:30',
    dailyEnd: '16:30'
  },
  {
    id: 2,
    workingDays: [2, 4, 6], // Terça(2), Quinta(4), Sábado(6)
    dailyStart: '10:00',
    dailyEnd: '17:00'
  },
  {
    id: 3,
    workingDays: [1, 2, 4, 5], // Seg(1), Ter(2), Qui(4), Sex(5)
    dailyStart: '09:00',
    dailyEnd: '18:00'
  }
];

    // Intervalo entre os slots em minutos
    const slotInterval = 20;

    for (const barber of barberConfig) {
      // Gerar slots específicos para este barbeiro
      const timeSlots = generateTimeSlots(
        barber.dailyStart, 
        barber.dailyEnd, 
        slotInterval
      );

      for (const day of barber.workingDays) {
        for (const slot of timeSlots) {
          await db.runAsync(
            `INSERT INTO barber_schedule (barber_id, day_of_week, time_slot) 
             VALUES (?, ?, ?)`,
            [barber.id, day, slot]
          );
        }
      }
    }
    
    console.log("Horários gerados para barbeiros com configurações específicas");
  } catch (error) {
    console.error("Erro ao gerar horários:", error);
    throw error;
  }

};

const generateTimeSlots = (start: string, end: string, interval: number) => {
  const slots = [];
  let [hours, minutes] = start.split(':').map(Number);
  const [endHours, endMinutes] = end.split(':').map(Number);

  while (hours < endHours || (hours === endHours && minutes <= endMinutes)) {
    slots.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
    
    minutes += interval;
    if (minutes >= 60) {
      hours += Math.floor(minutes / 60);
      minutes %= 60;
    }
  }
  
  return slots;
};