import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  Pressable, 
  StyleSheet, 
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  ScrollView
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import db from "../database";
import { Barber, getBarberById } from "../database/queries/barberQueries";
import { Client, getClientById } from "../database/queries/clientQueries";
import { Service, getServiceById } from "../database/queries/serviceQueries";
import { createAppointment } from "../database/queries/appointmentQueries";

interface Props {
  barberId: number;
  clientId: number;
  serviceId: number;
  scheduleId: number;
  date: string;
  time_slot: string;
  onConfirm: () => void;
  goToBack: () => void;
}

export default function ConfirmAppointment({ 
  barberId, 
  clientId, 
  serviceId, 
  scheduleId, 
  date, 
  time_slot, 
  onConfirm, 
  goToBack 
}: Props) {
  const [barber, setBarber] = useState<Barber | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    const loadData = async() => {
      try {
        setLoading(true);
        const [barberData, clientData, serviceData] = await Promise.all([
          getBarberById(db, barberId),
          getClientById(db, clientId),
          getServiceById(db, serviceId)
        ]);
        
        setBarber(barberData || null);
        setClient(clientData);
        setService(serviceData);

      } catch(error) {
        console.error("Erro ao carregar dados:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados do agendamento");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const confirmAppointment = async () => {
    try {
      setIsConfirming(true);
      
      await createAppointment(
        db, 
        barberId, 
        clientId, 
        serviceId, 
        scheduleId, 
        date, 
        time_slot
      );
      
      Alert.alert(
        "Agendamento Confirmado!",
        `Barbeiro: ${barber?.name || ''}\n` +
        `Corte: ${service?.name || ''}\n` +
        `Preço: R$ ${service?.price?.toFixed(2) || '0.00'}\n` +
        `Data: ${formatDate(date)}\n` +
        `Hora: ${time_slot}`,
        [{ text: "OK", onPress: onConfirm }]
      );
      
    } catch (error) {
      console.error("Erro ao confirmar agendamento:", error);
      Alert.alert("Erro", "Não foi possível confirmar o agendamento");
    } finally {
      setIsConfirming(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#e94560" />
          <Text style={styles.loadingText}>Carregando informações...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={goToBack}>
          <Ionicons name="arrow-back" size={28} color="#e94560" />
        </Pressable>
        <Text style={styles.title}>Confirmação</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Detalhes do Agendamento</Text>
        
        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Cliente:</Text>
            <Text style={styles.detailValue}>{client?.name || 'N/A'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Barbeiro:</Text>
            <Text style={styles.detailValue}>{barber?.name || 'N/A'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Serviço:</Text>
            <Text style={styles.detailValue}>{service?.name || 'N/A'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Preço:</Text>
            <Text style={[styles.detailValue, styles.priceText]}>
              R$ {service?.price?.toFixed(2) || '0.00'}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Data:</Text>
            <Text style={styles.detailValue}>{formatDate(date)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Horário:</Text>
            <Text style={styles.detailValue}>{time_slot}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable 
          style={({ pressed }) => [
            styles.confirmButton,
            pressed && styles.buttonPressed,
            isConfirming && styles.disabledButton
          ]}
          onPress={confirmAppointment}
          disabled={isConfirming}
        >
          {isConfirming ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.footerButtonText}>Confirmar Agendamento</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    paddingTop: StatusBar.currentHeight || 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e94560',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#0d8b8b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  detailLabel: {
    color: '#e94560',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  detailValue: {
    color: '#f0f0f0',
    fontSize: 16,
    fontWeight: '500',
    flex: 1.5,
    textAlign: 'right',
  },
  priceText: {
    fontWeight: 'bold',
    color: '#0d8b8b',
  },
  footer: {
    padding: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#0f3460',
    backgroundColor: '#1a1a2e',
  },
  confirmButton: {
    backgroundColor: '#0d8b8b',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0d8b8b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
    height: 50,
  },
  footerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#f0f0f0',
    marginTop: 15,
    fontSize: 16,
  },
});