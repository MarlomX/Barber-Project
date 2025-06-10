import React, { useState, useRef } from "react";
import { 
  Pressable, 
  StyleSheet, 
  Text, 
  TextInput, 
  View,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Animated,
  Modal
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
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
  
  // Estados para os modais
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Animações
  const fadeErrorAnim = useRef(new Animated.Value(0)).current;
  const fadeSuccessAnim = useRef(new Animated.Value(0)).current;

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

  const showErrorModal = (message: string) => {
    setErrorMessage(message);
    setShowError(true);
    Animated.timing(fadeErrorAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeErrorModal = () => {
    Animated.timing(fadeErrorAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowError(false);
    });
  };

  const showSuccessModal = () => {
    setShowSuccess(true);
    Animated.timing(fadeSuccessAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSuccessModal = () => {
    Animated.timing(fadeSuccessAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowSuccess(false);
      goToLogin(); // Redireciona para o login após fechar
    });
  };

  const handleRegister = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);
      
      if (await getClientByEmail(email)) {
        showErrorModal("Este email já está cadastrado!");
        return;
      }

      await createClient(name, email, password);
      showSuccessModal();
      
    } catch (error) {
      showErrorModal("Falha ao cadastrar. Tente novamente.");
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

       <Modal
        visible={showError}
        transparent={true}
        animationType="none"
        onRequestClose={closeErrorModal}
      >
        <Animated.View 
          style={[
            styles.errorOverlay, 
            { 
              opacity: fadeErrorAnim,
            }
          ]}
        >
          <View style={styles.errorModal}>
            <Ionicons 
              name="close-circle" 
              size={60} 
              color="#e94560" 
              style={styles.errorIcon}
            />
            <Text style={styles.errorTitle}>Erro</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>
            
            <Pressable 
              style={styles.errorButton} 
              onPress={closeErrorModal}
            >
              <Text style={styles.errorButtonText}>OK</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Modal>

      {/* Modal de Sucesso usando o componente Modal */}
      <Modal
        visible={showSuccess}
        transparent={true}
        animationType="none"
        onRequestClose={closeSuccessModal}
      >
        <Animated.View 
          style={[
            styles.successOverlay, 
            { 
              opacity: fadeSuccessAnim,
            }
          ]}
        >
          <View style={styles.successModal}>
            <Ionicons 
              name="checkmark-circle" 
              size={60} 
              color="#4BB543" 
              style={styles.successIcon}
            />
            <Text style={styles.successTitle}>Sucesso!</Text>
            <Text style={styles.successText}>Cadastro realizado com sucesso</Text>
            
            <Pressable 
              style={styles.successButton} 
              onPress={closeSuccessModal}
            >
              <Text style={styles.successButtonText}>Continuar</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Modal>
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
  // Estilos para o modal de erro
  errorOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorModal: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 25,
    width: '85%',
    maxWidth: 350,
    borderWidth: 2,
    borderColor: '#e94560',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  errorIcon: {
    marginBottom: 15,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e94560',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorText: {
    color: '#f0f0f0',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  errorButton: {
    backgroundColor: '#e94560',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  errorButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Estilos para o modal de sucesso
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModal: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 25,
    width: '85%',
    maxWidth: 350,
    borderWidth: 2,
    borderColor: '#0d8b8b',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  successIcon: {
    marginBottom: 15,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0d8b8b',
    textAlign: 'center',
    marginBottom: 10,
  },
  successText: {
    color: '#f0f0f0',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  successButton: {
    backgroundColor: '#0d8b8b',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  successButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});