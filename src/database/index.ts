import * as SQLite from 'expo-sqlite';
import { createClientTable } from './models/Client';

//Criar o banco de dados no local padrão
const db = SQLite.openDatabaseSync('BarberDB.db');

// Função de inicialização que cria todas as tabelas
const initDB = () => {
  createClientTable(db);
};

//Exporta o banco de dado e a função para iniciar o banco de dados
export { db, initDB };