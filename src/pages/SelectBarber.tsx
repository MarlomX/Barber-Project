import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import db from "../database";
import { getAllBarbers, Barber } from "../database/queries/barberQueries";


interface Props {
  onSelectBarber: (barberId: number) => void;
  goToSelectHaircut: () => void;
  goToBack: () => void;
}

export default function SelectBarber({ onSelectBarber, goToSelectHaircut, goToBack }: Props) {

  const [barbers, setBarbers] = useState<Barber[]>([]);
  const[loading, setLoading] = useState(true);
  const [selectBarberId, setSelectBarberId] = useState<number | null>(null);

  useEffect(() => {
    const loadBarbers = async() => {
      try{
        const data = await getAllBarbers(db);
        setBarbers(data);
      }catch(error){
        console.error("Erro ao carregar barbeiros: ", error)
      } finally{
        setLoading(false);
      }
    };

    loadBarbers();
  }, []);

  const handleSelect = (barber: Barber) => {
    setSelectBarberId(barber.id);
    onSelectBarber(barber.id);
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
      <Text style={styles.title}>Escolha o Barbeiro</Text>

      {barbers.map((barber) => (
        <Pressable 
        key={barber.id} 
        style={[
          styles.button,
          selectBarberId === barber.id && styles.selectedButton
          ]} onPress={() => onSelectBarber(barber.id)
          }>
          <Text style={styles.buttonText}>{barber.name}</Text>
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
  container: { 
    padding: 20,
    flex: 1
  },
  title: { 
    fontSize: 20, 
    marginBottom: 15, 
    color: "#333", 
    fontWeight: 'bold' 
  },
  button: { 
    backgroundColor: "#f0f0f0", 
    padding: 15,
    marginVertical: 5, 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  selectedButton: {
    backgroundColor: '#e0c097',
    borderColor: '#d0a070'
  },
  buttonText: { 
    color: "#333", 
    textAlign: "center",
    fontSize: 16 
  },
  continueButton: {
    backgroundColor: '#109c06',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  BackButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  }
});