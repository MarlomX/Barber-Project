import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import db from "../database";
import { Barber, getBarberForId } from "../database/queries/barberQueries";
import { Haircut, getHaircutsForBarbeId } from "../database/queries/haircutQueries";

interface Props {
  barberId: number;
  onSelectHaircut: (haircutId: number) => void;
  goToConfirmOrder: () => void;
  goToBack: () => void;
}

export default function SelectHaircut({ barberId, onSelectHaircut, goToConfirmOrder, goToBack }: Props) {


  const [barber, setBarber] = useState<Barber>(null);
  const [haircuts, setHaircuts] = useState<Haircut[]>([]);
  const[loading, setLoading] = useState(true);
  const [selectHaircutId, setSelectHaircutId] = useState<number | null>(null);

  useEffect(()=> {
    const loadData = async() => {
      try {
        const [barberData, hairCutsData] = await Promise.all([
          getBarberForId(db, barberId),
          getHaircutsForBarbeId(db, barberId)
        ]);
        setBarber(barberData || null);
        setHaircuts(hairCutsData);

      }catch(error){
        console.error("Erro ao caregar dados")
      } finally{
        setLoading(false)
      }
    }

    loadData();
  }, []);

  const handleSelect = (haircut: Haircut) => {
    setSelectHaircutId(haircut.id);
    onSelectHaircut(haircut.id);
  };

  if (loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#e0c097" />
        </View>
      );
    }

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Barbeiro: {barber?.name || "Barbeiro não encontrado"}</Text>      
    <Text style={styles.subtitle}>Escolha o Corte</Text>

      {haircuts.map((haircut) => (
        <Pressable
          key={haircut.id} 
          style={[
            styles.button,
            selectHaircutId === haircut.id && styles.selectedButton
        ]} 
          onPress={() => handleSelect(haircut)}>
          <Text style={styles.buttonText}>{haircut.name}</Text>
          <Text style={styles.buttonText}>{haircut.price ? haircut.price + "R$" : "Preço não disponível"}</Text>
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
  buttonText: { textAlign: "center", color: "#000"},
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
  },
  selectedButton: {
    backgroundColor: '#d0a070',
  }
});