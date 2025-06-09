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
import { getClientByEmail, createClient } from "../database/queries/clientQueries";

interface RegisterProps {
  goToLogin: () => void;
}

export default function Register({ goToLogin }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{name?: string; email?: string; password?: string}>({});

  // Função para validar email com regex
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Função para validar campos
  const validateFields = () => {
    const newErrors: {name?: string; email?: string; password?: string} = {};
    
    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }
    
    if (!email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!validateEmail(email)) {
      newErrors.email = "Email inválido";
    }
    
    if (!password) {
      newErrors.password = "Senha é obrigatória";
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);
      
      if (await getClientByEmail(db, email)) {
        Alert.alert("Erro", "Este email já está cadastrado!");
        return;
      }

      await createClient(db, name, email, password);
      Alert.alert("Sucesso", "Cadastro realizado com sucesso!", [
        { text: "OK", onPress: goToLogin }
      ]);
      
    } catch (error) {
      Alert.alert("Erro", "Falha ao cadastrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Studio Barber</Text>
        <Text style={styles.subtitle}>Crie sua conta</Text>
        
        {/* Campo Nome */}
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={24} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        
        {/* Campo Email */}
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
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        
        {/* Campo Senha */}
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
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        
        <Pressable 
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            loading && styles.disabledButton
          ]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </Pressable>
        
        <Pressable 
          style={({ pressed }) => pressed && styles.buttonPressed}
          onPress={goToLogin}
        >
          <Text style={styles.link}>Já tem conta? <Text style={styles.linkBold}>Faça login</Text></Text>
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
    marginBottom: 5,
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
    marginVertical: 20,
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
  errorText: {
    color: "#ff6b6b",
    marginBottom: 15,
    fontSize: 14,
    marginLeft: 10,
  },
});