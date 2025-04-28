import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from "react-native";
import db from "../database";
import { getClientByEmail, createClient } from "../database/queries/clientQueries";

//manda o usuario para a tela de login
interface RegisterProps {
  goToLogin: () => void;
}

export default function Register({ goToLogin }: RegisterProps) {
  // variaveis com os valores recebidos pelo usuario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Verifica se os campos estão prenchidos
  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      //Verifica se exite um cliente com esse email.
      if(await getClientByEmail(db,email)){
        Alert.alert("Erro", "Este email já está cadastrado!")
        return
      }
      
      //criar um novo cliente no banco de dados:

      await createClient(db, name, email, password);
      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      goToLogin();
    } catch (error) {
      Alert.alert("Erro: ", error.message);
    }
  };

  //Visualisção da tela
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
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
      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </Pressable>
      <Pressable onPress={goToLogin}>
        <Text style={styles.link}>Já tem conta? Faça login</Text>
      </Pressable>
    </View>
  );
}

//Estilos
const styles = StyleSheet.create({
  container: {
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
    color: 'blue',
    marginTop: 10,
    textAlign: 'center',
  },
});