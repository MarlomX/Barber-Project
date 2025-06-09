import React, { useState } from "react";
import { 
  Alert, 
  Pressable, 
  StyleSheet, 
  Text, 
  TextInput, 
  View,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
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
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }
    
    try {
      setLoading(true);
      const { success, clientId } = await authenticateClient(db, email, password);
      
      if (success) {
        onSelectClient(clientId);
        onSuccess();
      } else {
        Alert.alert("Erro", "Email ou senha incorretos");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha na autenticação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Studio Barber</Text>
        <Text style={styles.subtitle}>Faça login para continuar</Text>
        
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={24} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#888"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable 
            style={styles.togglePassword}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons 
              name={showPassword ? "eye-off-outline" : "eye-outline"} 
              size={24} 
              color="#888" 
            />
          </Pressable>
        </View>
        
        <Pressable 
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            loading && styles.disabledButton
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </Pressable>
        
        <Pressable 
          style={({ pressed }) => pressed && styles.buttonPressed}
          onPress={goToRegister}
        >
          <Text style={styles.link}>Não tem conta? <Text style={styles.linkBold}>Cadastre-se</Text></Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    paddingTop: StatusBar.currentHeight || 20,
  },
  card: {
    width: "85%",
    backgroundColor: "#16213e",
    padding: 25,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    color: "#e94560",
    marginBottom: 5,
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#f0f0f0",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f3460",
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#fff",
    paddingVertical: 15,
    fontSize: 16,
  },
  togglePassword: {
    padding: 5,
  },
  button: {
    backgroundColor: "#e94560",
    paddingVertical: 16,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#e94560",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  link: {
    color: "#ccc",
    textAlign: "center",
    fontSize: 15,
  },
  linkBold: {
    color: "#e94560",
    fontWeight: "bold",
  },
});