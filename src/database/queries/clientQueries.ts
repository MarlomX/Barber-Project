import { SQLiteDatabase } from 'expo-sqlite';

// Defini uma interface Cliente
interface Client {
    id: number;
    name: string;
    email: string;
    password: string;
  }
  // Define os tipos de retornos das funções
  type AuthResult = [success: boolean, message: string];
  type GetClientResult = Client | undefined;


  // Busca um cliente no banco de dados pelo Email, retornando uma interface Cliente ou um undefined;
export const getClientByEmail = async (
    db: SQLiteDatabase,
    email: string
): Promise<GetClientResult> => {
    try{
        const result = await db.getAllAsync<Client>(
            'SELECT * FROM client WHERE email = ?;',
             [email]
        );
        return result[0];
    }catch (error) {
        throw new Error('Erro ao procura Cliente pelo Email: ' + error.message);
    }
};

// Criar um novo cliente na tabela Cliente
export const createClient = async (db: SQLiteDatabase ,name: string, email:string, password:string) =>{
    try{
        await db.runAsync(
            'INSERT INTO client (name, email, password) VALUES (?, ?, ?);',
        [name, email, password]
        );
    } catch(error){
        throw new Error("Erro ao criar um cliente: " + error.message);
    }
};

/*
Recebe um Email e Senha e verifica se eles são validos
Retorna um array o primeiro valor[0] define se a autentificação foi um sucesso
O segundo valor [1] mudar, em caso de sucesso envia o nome do usuario.
Em caso de fracasso manda o motivo da falhar.
*/
export const authenticateClient = async(
    db: SQLiteDatabase,
    email:string,
    password:string,
): Promise<AuthResult> =>{
    try{
        const client = await getClientByEmail(db, email);
        if(client){
            if (client.password === password){
                return [true, client.name];
            } else{
                return [false, "Senha Inccoreta"];
            }
        } else{
            return [false, "Email Inccoreto ou não cadastrado"]
        }
    } catch(error){
        throw new Error("Erro ao autenticar o Cliente: " + error.message);
    }
};