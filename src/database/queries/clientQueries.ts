import { supabase } from '../supabase';


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
    email: string
): Promise<GetClientResult> => {
    try {
        const {data, error } = await supabase
        .from('client')
        .select('*')
        .eq('email', email)
        .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        return data || undefined;
    } catch (error) {
        throw new Error('Erro ao procurar cliente pelo email: ' + error.message);
    }
};

/**
 * Busca um cliente no banco de dados pelo ID
 * @returns Interface Cliente ou undefined se não encontrado
 */
export const getClientById = async (
    id: number
): Promise<GetClientResult> => {
    try {
        const {data, error} = await supabase
        .from('client')
        .select('*')
        .eq('id', id)
        .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        return data || undefined;
    } catch (error) {
        throw new Error('Erro ao procurar cliente pelo ID: ' + error.message);
    }
};

/**
 * Cria um novo cliente na tabela Cliente
 */
export const createClient = async (
    name: string,
    email: string,
    password: string
): Promise<void> => {
    try {
        const {error} = await supabase
        .from('client')
        .insert([{name, email, password}])
        
        if (error) throw error;
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
    email: string,
    password: string
): Promise<AuthResult> => {
    try {
        const client = await getClientByEmail(email);
        
        if (client && client.password === password) {
            return { success: true, clientId: client.id };
        } else {
            return { success: false, clientId: 0 };
        }
    } catch (error) {
        throw new Error('Erro ao autenticar cliente: ' + error.message);
    }
};