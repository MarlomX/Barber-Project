import { SQLiteDatabase } from 'expo-sqlite';

// Defini uma interface Cliente
interface Client {
    id: number;
    name: string;
    email: string;
    password: string;
  }
  // Define os tipos de retornos das funções
  type AuthResult = {success: boolean, message: string};
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
Retorna um objeto, o primeiro valor 'success' e um boleano que indica se a authetificação foi um sucesso.
Já o segundo valor e uma string, em casso de sucesso estar com o nome do cliente. 
No caso de um fracasso e uma menssagem com o motivo do fracasso.
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
                return {success: true, message: client.name};
            } else{
                return {success: false, message: "Senha Inccoreta"};
            }
        } else{
            return {success: false, message: "Email Inccoreto ou não cadastrado"}
        }
    } catch(error){
        throw new Error("Erro ao autenticar o Cliente: " + error.message);
    }
};