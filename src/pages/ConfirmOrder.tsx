import React, {useEffect, useState} from "react";
import { View, Text, Pressable, StyleSheet, Alert,ActivityIndicator } from "react-native";
import db from "../database";
import { Barber, getBarberForId } from "../database/queries/barberQueries";
import { Service, getServiceForId } from "../database/queries/serviceQueries";

interface Props {
  barberId: number;
  serviceId: number;
  onConfirm : () => void;
  goToBack: () => void;
}

export default function ConfirmOrder({ barberId, serviceId, onConfirm, goToBack }: Props) {
  const [barber, setBarber] = useState<Barber>(null);
  const [service, setService] = useState<Service>(null);
  const[loading, setLoading] = useState(true);

  useEffect(()=> {
    const loadData = async() => {
      try {
        const [barberData, serviceData] = await Promise.all([
          getBarberForId(db, barberId),
          getServiceForId(db, serviceId)
        ]);
        setBarber(barberData || null);
        setService(serviceData);

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
    Alert.alert("Pedido Confirmado", `Barbeiro: ${barber.name}\nCorte: ${service.name}\nPreço: ${service.price}R$`);
    onConfirm();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirme seu Pedido</Text>
      <Text style={styles.text}>Barbeiro: {barber.name}</Text>
      <Text style={styles.text}>Corte: {service.name}</Text>
      <Text style={styles.text}>Preço: {service.price}R$</Text>
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