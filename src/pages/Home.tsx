import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import db from "../database";
import { Client, getClientById } from "../database/queries/clientQueries";

interface HomeProps {
  client_id: number;
  onLogout: () => void;
  goToSelectBarber: () => void;
  goToHistory: () => void;
}

export default function Home({ client_id, onLogout, goToSelectBarber, goToHistory }: HomeProps) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const clientData = await getClientById(db, client_id);
        setClient(clientData);
      } catch (error) {
        console.error("Erro ao carregar dados do cliente:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [client_id]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          {loading ? (
            <ActivityIndicator size="small" color="#e94560" />
          ) : client ? (
            `Bem-vindo, ${client.name}!`
          ) : (
            "Bem-vindo!"
          )}
        </Text>
        
        <Text style={styles.text}>
          Você está logado no sistema da <Text style={styles.brand}>Studio Barber</Text>.
        </Text>
        
        <View style={styles.buttonGroup}>
          <Pressable 
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed
            ]} 
            onPress={goToSelectBarber}
          >        
            <Text style={styles.buttonText}>Agendar</Text>
          </Pressable>
          
          <Pressable 
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed
            ]} 
            onPress={goToHistory}
          >        
            <Text style={styles.buttonText}>Ver Histórico</Text>
          </Pressable>
          
          <Pressable 
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.buttonPressed
            ]} 
            onPress={onLogout}
          >
            <Text style={styles.buttonText}>Sair</Text>
          </Pressable>
        </View>
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
    padding: 25,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    color: "#fff",
    marginBottom: 25,
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  text: {
    color: "#f0f0f0",
    marginBottom: 30,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
  },
  brand: {
    fontWeight: "700",
    color: "#e94560",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  buttonGroup: {
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: "#e94560",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#e94560",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: "#0d8b8b",  // Turquesa contrastante
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#0d8b8b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
  logoutButton: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#4a5085",
    borderRadius: 10,
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});