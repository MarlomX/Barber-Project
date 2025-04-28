import React from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";

interface Props {
  barberId: number;
  haircut: string;
  onConfirm : () => void;
  goToBack: () => void;
}

export default function ConfirmOrder({ barberId, haircut, onConfirm, goToBack }: Props) {
  const confirm = () => {
    Alert.alert("Pedido Confirmado", `Barbeiro: ${barberId}\nCorte: ${haircut}`);
    onConfirm();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirme seu Pedido</Text>
      <Text style={styles.text}>Barbeiro: {barberId}</Text>
      <Text style={styles.text}>Corte: {haircut}</Text>
      <Pressable style={styles.button} onPress={confirm}>
        <Text style={styles.buttonText}>Confirmar</Text>
      </Pressable>
      <Pressable style={styles.BackButton} onPress={goToBack}>
        <Text style={styles.buttonText}>Voltar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, marginBottom: 15, color: "#333" },
  text: { marginVertical: 5, color: "#444" },
  button: { backgroundColor: "#27ae60", padding: 10, marginTop: 15, borderRadius: 5 },
  buttonText: { textAlign: "center", color: "#fff" },
  BackButton: {
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  }
});