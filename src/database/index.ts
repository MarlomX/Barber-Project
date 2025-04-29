import * as SQLite from 'expo-sqlite';
import { createClientTable } from './models/Client';
import { createBarberTable } from './models/Barber';
import { createHaircutTable } from './models/Haircut';

//Criar o banco de dados no local padrão
const db = SQLite.openDatabaseSync('BarberDB.db');

// Função de inicialização que cria todas as tabelas
export const initDB = async() => {
  createClientTable(db);
  createBarberTable(db);
  createHaircutTable(db);
};

//Exporta o banco de dado e a função para iniciar o banco de dados
export default db ;