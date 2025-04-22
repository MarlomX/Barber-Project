import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

interface Props {
  barber: string;
  onSelectHaircut: (Haircut: string) => void;
  goToConfirmOrder: () => void;
  goToBack: () => void;
}

export default function SelectHaircut({ barber, onSelectHaircut, goToConfirmOrder, goToBack }: Props) {
  const cortes = ["Corte Social", "Fade", "Navalhado"];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Barbeiro: {barber}</Text>
      <Text style={styles.subtitle}>Escolha o Corte</Text>
      {cortes.map((haircut) => (
        <Pressable key={haircut} style={styles.button} onPress={() => onSelectHaircut(haircut)}>
          <Text style={styles.buttonText}>{haircut}</Text>
        </Pressable>
      ))}
    <Pressable style={styles.continueButton} onPress={goToConfirmOrder}>        
      <Text style={styles.buttonText}>Continuar</Text>
    </Pressable>
    <Pressable style={styles.BackButton} onPress={goToBack}>
      <Text style={styles.buttonText}>Voltar</Text>
    </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 18, color: "#333" },
  subtitle: { fontSize: 16, marginVertical: 10 },
  button: { backgroundColor: "#e0c097", padding: 10, marginVertical: 5, borderRadius: 5 },
  buttonText: { textAlign: "center", color: "#000" },
  continueButton: {
    backgroundColor: '#109c06',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  BackButton: {
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  }
});