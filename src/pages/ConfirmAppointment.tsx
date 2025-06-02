import React, {useEffect, useState} from "react";
import { View, Text, Pressable, StyleSheet, Alert,ActivityIndicator } from "react-native";
import db from "../database";
import { Barber, getBarberForId } from "../database/queries/barberQueries";
import { Client, getClientById} from "../database/queries/clientQueries"
import { Service, getServiceForId } from "../database/queries/serviceQueries";
import { createAppointment} from "../database/queries/appointmentQueries";

interface Props {
  barberId: number;
  clientId: number;
  serviceId: number;
  scheduleId: number;
  date: string;
  time_slot: string;
  onConfirm : () => void;
  goToBack: () => void;
}

export default function ConfirmAppointment({ barberId, clientId, serviceId, scheduleId, date, time_slot, onConfirm, goToBack }: Props) {
  const [barber, setBarber] = useState<Barber>(null);
  const [client, setClient] = useState<Client>(null);
  const [service, setService] = useState<Service>(null);
  const[loading, setLoading] = useState(true);

  useEffect(()=> {
    const loadData = async() => {
      try {
        const [barberData, clientData, serviceData] = await Promise.all([
          getBarberForId(db, barberId),
          getClientById(db, clientId),
          getServiceForId(db, serviceId)
        ]);
        setBarber(barberData || null);
        setClient(clientData);
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
    createAppointment(db, barberId, clientId, serviceId, scheduleId, date, time_slot);
    Alert.alert("Pedido Confirmado", `Barbeiro: ${barber.name}
      \nCorte: ${service.name}
      \nPreço: ${service.price}R$
      \nData: ${date}
      \nHora: ${time_slot}`
    );
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