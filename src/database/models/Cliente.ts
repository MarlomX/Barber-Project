export const createClienteTable = (db: any) => {
    db.transaction(tx => {
        tx.executeSql(
        `CREATE TABLE IF NOT EXISTS cliente (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL
        );`,
        [], 
        () => console.log("Tabela cliente criada"),
        (error: any) => console.error("Erro ao criar tabela cliente: ", error)
    );    
    });
};