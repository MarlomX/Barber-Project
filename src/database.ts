import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'BarberDB.db', location: 'default' },
  () => {},
  error => console.error('Erro ao abrir banco de dados', error)
);

// Criação da tabela de clientes
const initDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS cliente (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL
      );`,
      [],
      () => console.log('Tabela cliente criada'),
      error => console.error('Erro ao criar tabela', error)
    );
  });
};

export { db, initDB };