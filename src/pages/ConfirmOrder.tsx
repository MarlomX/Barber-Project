import React, {useEffect, useState} from "react";
import { View, Text, Pressable, StyleSheet, Alert,ActivityIndicator } from "react-native";
import db from "../database";
import { Barber, getBarberForId } from "../database/queries/barberQueries";
import { Haircut, getHaircutForId } from "../database/queries/haircutQueries";

interface Props {
  barberId: number;
  haircutId: number;
  onConfirm : () => void;
  goToBack: () => void;
}

export default function ConfirmOrder({ barberId, haircutId, onConfirm, goToBack }: Props) {
  const [barber, setBarber] = useState<Barber>(null);
  const [haircut, setHaircut] = useState<Haircut>(null);
  const[loading, setLoading] = useState(true);

  useEffect(()=> {
    const loadData = async() => {
      try {
        const [barberData, hairCutsData] = await Promise.all([
          getBarberForId(db, barberId),
          getHaircutForId(db, haircutId)
        ]);
        setBarber(barberData || null);
        setHaircut(hairCutsData);

      }catch(error){
        console.error("Erro ao caregar dados")
      } finally{
        setLoading(false)
      }
    }

    loadData();
  }, []);

  if (loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#e0c097" />
        </View>
      );
    }

  const confirm = () => {
    Alert.alert("Pedido Confirmado", `Barbeiro: ${barber.name}\nCorte: ${haircut.name}\nPreço: ${haircut.price}R$`);
    onConfirm();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirme seu Pedido</Text>
      <Text style={styles.text}>Barbeiro: {barber.name}</Text>
      <Text style={styles.text}>Corte: {haircut.name}</Text>
      <Text style={styles.text}>Preço: {haircut.price}R$</Text>
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
  buttonText: { textAlign: "center", color: "#fff"},
  BackButton: {
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  }
});