import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import db from "../database";
import { Client, getClientById} from "../database/queries/clientQueries";

interface HomeProps {
  client_id: number;
  onLogout: () => void;
  goToSelectBarber: () => void;
  goToHistory: () => void;
}

export default function Home({ client_id, onLogout, goToSelectBarber, goToHistory }: HomeProps) {

  const [client, setClient] = useState<Client | null>(null);

useEffect(() => {
    const loadData = async () => {
      try {
        const [clientData] = await Promise.all([
          getClientById(db, client_id),
        ]);
        setClient(clientData);
      } catch (error) {
        console.error("Erro ao carregar dados do cliente:", error);
      }
    };

    loadData();
  }, [client_id]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {client ? (
          <Text style={styles.title}>Bem-vindo, {client.name}!</Text>
        ) : (
          <Text style={styles.title}>Carregando...</Text>
        )}
        <Text style={styles.text}>
          Você está logado no sistema da <Text style={styles.bold}>Studio Barber</Text>.
        </Text>
        <Pressable style={styles.continueButton} onPress={goToSelectBarber}>        
          <Text style={styles.buttonText}>Agendar</Text>
        </Pressable>
        <Pressable style={styles.continueButton} onPress={goToHistory}>        
          <Text style={styles.buttonText}>Ver Hístorico</Text>
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