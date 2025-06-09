import { SQLiteDatabase } from 'expo-sqlite';

// Interface para representar um Cliente
export interface Client {
    id: number;
    name: string;
    email: string;
    password: string;
}

// Tipos de retorno para as funções
type AuthResult = {
    success: boolean;
    clientId: number;
};

type GetClientResult = Client | undefined;

/**
 * Busca um cliente no banco de dados pelo Email
 * @returns Interface Cliente ou undefined se não encontrado
 */
export const getClientByEmail = async (
    db: SQLiteDatabase,
    email: string
): Promise<GetClientResult> => {
    try {
        const result = await db.getAllAsync<Client>(
            'SELECT * FROM client WHERE email = ?;',
            [email]
        );
        return result[0];
    } catch (error) {
        throw new Error('Erro ao procurar cliente pelo email: ' + error.message);
    }
};

/**
 * Busca um cliente no banco de dados pelo ID
 * @returns Interface Cliente ou undefined se não encontrado
 */
export const getClientById = async (
    db: SQLiteDatabase,
    id: number
): Promise<GetClientResult> => {
    try {
        const result = await db.getAllAsync<Client>(
            'SELECT * FROM client WHERE id = ?;',
            [id]
        );
        return result[0];
    } catch (error) {
        throw new Error('Erro ao procurar cliente pelo ID: ' + error.message);
    }
};

/**
 * Cria um novo cliente na tabela Cliente
 */
export const createClient = async (
    db: SQLiteDatabase,
    name: string,
    email: string,
    password: string
): Promise<void> => {
    try {
        await db.runAsync(
            'INSERT INTO client (name, email, password) VALUES (?, ?, ?);',
            [name, email, password]
        );
    } catch (error) {
        throw new Error('Erro ao criar cliente: ' + error.message);
    }
};

/**
 * Autentica um cliente usando email e senha
 * @returns Objeto com: 
 *   - success: booleano indicando se a autenticação foi bem-sucedida
 *   - clientId: ID do cliente em caso de sucesso, 0 em caso de falha
 */
export const authenticateClient = async (
    db: SQLiteDatabase,
    email: string,
    password: string
): Promise<AuthResult> => {
    try {
        const client = await getClientByEmail(db, email);
        
        if (client && client.password === password) {
            return { success: true, clientId: client.id };
        } else {
            return { success: false, clientId: 0 };
        }
    } catch (error) {
        throw new Error('Erro ao autenticar cliente: ' + error.message);
    }
};