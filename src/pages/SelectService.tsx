import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import db from "../database";
import { Barber, getBarberForId } from "../database/queries/barberQueries";
import { Service, getServicesForBarbeId } from "../database/queries/serviceQueries";

interface Props {
  barberId: number;
  onSelectService: (serviceId: number) => void;
  goToConfirmOrder: () => void;
  goToBack: () => void;
}

export default function SelectService({ barberId, onSelectService, goToConfirmOrder, goToBack }: Props) {
  const [barber, setBarber] = useState<Barber | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [barberData, servicesData] = await Promise.all([
          getBarberForId(db, barberId),
          getServicesForBarbeId(db, barberId)
        ]);
        setBarber(barberData || null);
        setServices(servicesData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [barberId]);

  const handleSelect = (service: Service) => {
    setSelectedServiceId(service.id);
    onSelectService(service.id);
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

      <ScrollView style={styles.scrollContainer}>
        {services.map((service) => (
          <Pressable
            key={service.id}
            style={[
              styles.button,
              selectedServiceId === service.id && styles.selectedButton
            ]}
            onPress={() => handleSelect(service)}
          >
            <Text style={styles.buttonText}>{service.name}</Text>
            <Text style={styles.priceText}>
              {service.price ? `R$ ${service.price.toFixed(2)}` : "Preço não disponível"}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.continueButton, !selectedServiceId && styles.disabledButton]}
          onPress={goToConfirmOrder}
          disabled={!selectedServiceId}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </Pressable>
        <Pressable style={styles.backButton} onPress={goToBack}>
          <Text style={styles.buttonText}>Voltar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1
  },
  title: {
    fontSize: 18,
    color: "#333",
    marginBottom: 5
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 10,
    fontWeight: 'bold'
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 15
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
    textAlign: "center",
    color: "#333",
    fontSize: 16
  },
  priceText: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
    marginTop: 5
  },
  footer: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  continueButton: {
    backgroundColor: '#109c06',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  backButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: '#909090'
  }
});