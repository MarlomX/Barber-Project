import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from "react-native";
import * as SQLite from 'expo-sqlite';

//busca o banco de dados
const db = SQLite.openDatabaseSync('BarberDB.db');

// define os estilos
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    width: 300,
    margin: 20,
  },
  title: {
    fontSize: 20,
    color: '#e0c097',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#e0c097',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  link: {
    color: '#aaa',
    marginTop: 10,
    textAlign: 'center',
  },
});

// cria uma interface para os dados do usuario e defini sesu tipos
interface Cliente {
  id: number;
  nome: string;
  email: string;
  senha: string;
}

//criar uma interface que quando chamada envia o usuario para tela de resgistro ou para tela Home
interface LoginProps {
  goToRegister: () => void;
  onSuccess: (name: string) => void;
}

export default function Login({ goToRegister, onSuccess }: LoginProps) {
  //define as variaveis para receber o email e a senha
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  //verifica se os capos estão prenchidos
  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }
  // tentar conferir se o usuario esta no banco de dados
    try {
      // Usar getAllAsync para SELECT com parâmetros seguros
      //verifica se existe um Email no banco de dados igual ao recebido
      const result = await db.getAllAsync<Cliente>(
        'SELECT * FROM cliente WHERE email = ?;',
        [email]
      );
      // caso não encontre laçã uma mensagem de erro
      if (result.length === 0) {
        Alert.alert("Erro", "Usuário não encontrado!");
      } // Caso encontre verifica se a senha e a mesma que esta no banco de dados
      else {
        const user = result[0];
        //Caso for a mesma comfirma o login
        if (user.senha === senha) {
          onSuccess(user.nome);
        } // caso contario manda mensagem de error
         else {
          Alert.alert("Erro", "Senha incorreta!");
        }
      }
    } catch (error) {
      Alert.alert("Erro", "Falha na autenticação!");
    }
  };

  // visualisação da tela
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </Pressable>
      <Pressable onPress={goToRegister}>
        <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
      </Pressable>
    </View>
  );
}