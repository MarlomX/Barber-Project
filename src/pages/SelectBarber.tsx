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
import { getAllBarbers, Barber } from "../database/queries/barberQueries";

interface Props {
  onSelectBarber: (barberId: number) => void;
  goToNext: () => void;
  goToBack: () => void;
}

export default function SelectBarber({ onSelectBarber, goToNext, goToBack }: Props) {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBarberId, setSelectedBarberId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBarbers = async () => {
      try {
        const data = await getAllBarbers();
        setBarbers(data);
        setError(null);
      } catch (error) {
        console.error("Erro ao carregar barbeiros: ", error);
        setError("Falha ao carregar barbeiros. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    loadBarbers();
  }, []);

  const handleSelect = (barberId: number) => {
    setSelectedBarberId(barberId);
    onSelectBarber(barberId);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e94560" />
          <Text style={styles.loadingText}>Carregando barbeiros...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={() => setLoading(true)}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </Pressable>
        </View>
      );
    }

    if (barbers.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum barbeiro disponível</Text>
        </View>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {barbers.map((barber) => (
          <Pressable
            key={barber.id}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              selectedBarberId === barber.id && styles.selectedButton
            ]}
            onPress={() => handleSelect(barber.id)}
          >
            <Text style={[styles.buttonText, selectedBarberId === barber.id && styles.selectedButtonText]}>
              {barber.name}
            </Text>
            {selectedBarberId === barber.id && (
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
        <Text style={styles.title}>Escolha o Barbeiro</Text>
      </View>

      {renderContent()}

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            pressed && styles.buttonPressed,
            !selectedBarberId && styles.disabledButton
          ]}
          onPress={goToNext}
          disabled={!selectedBarberId}
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  button: {
    backgroundColor: '#16213e',
    padding: 18,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0f3460',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
  },
  selectedButtonText: {
    color: '#0d8b8b',
    fontWeight: 'bold',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#fff',
    marginTop: 15,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#e94560',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    fontWeight: '500',
  },
  checkIcon: {
    marginLeft: 10,
  },
});