import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  Pressable, 
  StyleSheet, 
  ActivityIndicator, 
  ScrollView,
  SafeAreaView,
  StatusBar
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import db from "../database";
import { Barber, getBarberById } from "../database/queries/barberQueries";
import { Service, getServicesForBarbeId } from "../database/queries/serviceQueries";

interface Props {
  barberId: number;
  onSelectService: (serviceId: number) => void;
  goToNext: () => void;
  goToBack: () => void;
}

export default function SelectService({ barberId, onSelectService, goToNext, goToBack }: Props) {
  const [barber, setBarber] = useState<Barber | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [barberData, servicesData] = await Promise.all([
          getBarberById(db, barberId),
          getServicesForBarbeId(db, barberId)
        ]);
        
        if (!barberData) {
          throw new Error("Barbeiro não encontrado");
        }
        
        setBarber(barberData);
        setServices(servicesData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setError("Falha ao carregar serviços. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [barberId]);

  const handleSelect = (serviceId: number) => {
    setSelectedServiceId(serviceId);
    onSelectService(serviceId);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#e94560" />
          <Text style={styles.centerText}>Carregando serviços...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable 
            style={({ pressed }) => [
              styles.retryButton,
              pressed && styles.buttonPressed
            ]}
            onPress={() => setLoading(true)}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </Pressable>
        </View>
      );
    }

    if (services.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Nenhum serviço disponível</Text>
        </View>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {services.map((service) => (
          <Pressable
            key={service.id}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              selectedServiceId === service.id && styles.selectedButton
            ]}
            onPress={() => handleSelect(service.id)}
          >
            <Text style={[styles.serviceName, selectedServiceId === service.id && styles.selectedText]}>
              {service.name}
            </Text>
            <Text style={[styles.priceText, selectedServiceId === service.id && styles.selectedPrice]}>
              {service.price ? `R$ ${service.price.toFixed(2)}` : "Preço não disponível"}
            </Text>
            {selectedServiceId === service.id && (
              <Ionicons name="checkmark-circle" size={24} color="#0d8b8b" style={styles.checkIcon} />
            )}
          </Pressable>
        ))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={goToBack}>
          <Ionicons name="arrow-back" size={28} color="#e94560" />
        </Pressable>
        <Text style={styles.title}>
          {barber ? `Serviços de ${barber.name}` : "Escolha o Serviço"}
        </Text>
      </View>

      {!loading && !error && services.length > 0 && (
        <Text style={styles.subtitle}>Escolha o Corte</Text>
      )}

      {renderContent()}

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            pressed && styles.buttonPressed,
            !selectedServiceId && styles.disabledButton
          ]}
          onPress={goToNext}
          disabled={!selectedServiceId}
        >
          <Text style={styles.footerButtonText}>Continuar</Text>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  centerText: {
    color: '#f0f0f0',
    marginTop: 15,
    fontSize: 16,
  },
  errorText: {
    color: '#e94560',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    fontWeight: '500',
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 10,
  },
  button: {
    backgroundColor: '#16213e',
    padding: 18,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0f3460',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedButton: {
    backgroundColor: 'rgba(13, 139, 139, 0.2)',
    borderColor: '#0d8b8b',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  serviceName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  selectedText: {
    color: '#0d8b8b',
    fontWeight: 'bold',
  },
  priceText: {
    color: '#f0f0f0',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 10,
  },
  selectedPrice: {
    color: '#0d8b8b',
    fontWeight: 'bold',
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  footer: {
    padding: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#0f3460',
    backgroundColor: '#1a1a2e',
  },
  continueButton: {
    backgroundColor: '#0d8b8b',
    padding: 16,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#0d8b8b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  footerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: '#0d8b8b',
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});