import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import db from "../database";
import { authenticateClient } from "../database/queries/clientQueries";                                                                                                                                                                
interface LoginProps {
  goToRegister: () => void;
  onSelectClient: (client: number) => void;
  onSuccess: () => void;
}

export default function Login({ goToRegister, onSelectClient, onSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }
    try {
      const { success, clientId } = await authenticateClient(db, email, password);
      if (success) {
        onSelectClient(clientId)
        onSuccess();
      } else {
        Alert.alert("Erro: Email ou Senha incorretos");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha na autenticação!");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#888"
        />
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </Pressable>
        <Pressable onPress={goToRegister}>
          <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
  },
  card: {
    width: "85%",
    backgroundColor: "#16213e",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    color: "#e94560",
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#0f3460",
    color: "#fff",
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#e94560",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  link: {
    color: "#e94560",
    textAlign: "center",
  },
});