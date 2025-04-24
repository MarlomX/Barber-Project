import SQLite from 'react-native-sqlite-storage';
import { createClienteTable } from './models/Cliente';

//Criar o banco de dados no local padrão
const db = SQLite.openDatabase(
  { name: 'BarberDB.db', location: 'default' },
  () => console.log("Banco Conectado"),
  error => console.error('Erro ao abrir banco de dados', error)
);

// Função de inicialização que cria todas as tabelas
const initDB = () => {
  createClienteTable(db);
};

export { db, initDB };