import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";


interface Props {
  onSelectBarber: (barber: string) => void;
  goToSelectHaircut: () => void;
  goToBack: () => void;
}

export default function SelectBarber({ onSelectBarber, goToSelectHaircut, goToBack }: Props) {
  const barbeiros = ["teste", "........", "........."];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha o Barbeiro</Text>
      {barbeiros.map((nome) => (
        <Pressable key={nome} style={styles.button} onPress={() => onSelectBarber(nome)}>
          <Text style={styles.buttonText}>{nome}</Text>
        </Pressable>
      ))}
      <Pressable style={styles.continueButton} onPress={goToSelectHaircut}>        
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
  title: { fontSize: 20, marginBottom: 15, color: "#333" },
  button: { backgroundColor: "#e0c097", padding: 10, marginVertical: 5, borderRadius: 5 },
  buttonText: { color: "#000", textAlign: "center" },
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