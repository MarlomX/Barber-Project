import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from "react-native";
import db from "../database";
import { authenticateClient } from "../database/queries/clientQueries";

//criar uma interface que quando chamada envia o usuario para tela de resgistro ou para tela Home
interface LoginProps {
  goToRegister: () => void;
  onSuccess: (name: string) => void;
}

export default function Login({ goToRegister, onSuccess }: LoginProps) {
  //define as variaveis para receber o email e a senha
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //verifica se os capos estão prenchidos
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }
    try {
      /* 
      Tentar autenticar o cliente.
      Recebe um objeto, o primeiro valor 'success' e um boleano que indica se a authetificação foi um sucesso.
      Já o segundo valor e uma string, em casso de sucesso estar com o nome do cliente. 
      No caso de um fracasso e uma menssagem com o motivo do fracasso.
       */
      const { success, message} = await authenticateClient(db, email, password);
      if(success){
        onSuccess(message);
      } else {
          Alert.alert("Erro: ", message);
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
        value={password}
        onChangeText={setPassword}
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