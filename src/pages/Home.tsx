import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface HomeProps {
  userName: string;
  onLogout: () => void;
  goToSelectBarber: () => void;
}

export default function Home({ userName, onLogout, goToSelectBarber }: HomeProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Bem-vindo, {userName}!</Text>
        <Text style={styles.text}>
          Você está logado no sistema da <Text style={styles.bold}>Studio Barber</Text>.
        </Text>
        <Pressable style={styles.continueButton} onPress={goToSelectBarber}>        
          <Text style={styles.buttonText}>Continuar</Text>
        </Pressable>
        <Pressable style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.buttonText}>Sair</Text>
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
  text: {
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
    color: "#e94560",
  },
  continueButton: {
    backgroundColor: "#e94560",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  logoutButton: {
    backgroundColor: "#0f3460",
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  }
});