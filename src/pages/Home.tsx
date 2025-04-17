import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

interface HomeProps {
  userName: string;
  onLogout: () => void; // Nova prop
}

export default function Home({ userName, onLogout }: HomeProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Bem-vindo, {userName}!</Text>
      <Text style={styles.text}>
        Você está logado no sistema da <Text style={styles.bold}>Studio Barber</Text>.
      </Text>
      <Pressable style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.buttonText}>Sair</Text>
      </Pressable>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    width: 300,
    margin: 20,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    color: '#e0c097',
    marginBottom: 15,
  },
  text: {
    color: '#fff',
    marginVertical: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  }
});