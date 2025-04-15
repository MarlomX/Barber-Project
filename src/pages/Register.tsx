import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from "react-native";
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('BarberDB.db');

interface RegisterProps {
  goToLogin: () => void;
}

export default function Register({ goToLogin }: RegisterProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleRegister = async () => {
    if (!nome || !email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      // Verificar se email já existe
      const existingUser = await db.getAllAsync(
        'SELECT * FROM cliente WHERE email = ?;',
        [email]
      );

      if (existingUser.length > 0) {
        Alert.alert("Erro", "Este email já está cadastrado!");
        return;
      }

      // Inserir novo usuário
      await db.runAsync(
        'INSERT INTO cliente (nome, email, senha) VALUES (?, ?, ?);',
        [nome, email, senha]
      );

      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      goToLogin();
    } catch (error) {
      Alert.alert("Erro", "Falha no cadastro: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
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
        value={senha}
        onChangeText={setSenha}
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