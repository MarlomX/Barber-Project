import * as SQLite from 'expo-sqlite';
import {createClientTable} from './models/Client';
import {createBarberTable, populateBarberTable} from './models/Barber';
import {createServiceTable, populateServiceTable} from './models/Service';
import {createBarberServiceTable, populateBarberServiceTable} from './models/BarberService';
import {createBarberScheduleTable, populateBarberSchedule} from './models/BarberSchedule'
import {createAppointmentTable} from './models/Appointment '

//Criar o banco de dados no local padrão
const db = SQLite.openDatabaseSync('BarberDB.db');

const createDB = async() => {
  await createClientTable(db);
  await createBarberTable(db);
  await createServiceTable(db);
  await createBarberServiceTable(db);
  await createBarberScheduleTable(db);
  await createAppointmentTable(db);
}

const populateDB = async() => {
  await populateBarberTable(db);
  await populateServiceTable(db);
  await populateBarberServiceTable(db);
  await populateBarberSchedule(db);
}

// Função de inicialização que cria todas as tabelas
export const initDB = async() => {
  await createDB();
  await populateDB();
};

//Exporta o banco de dado e a função para iniciar o banco de dados
export default db ;