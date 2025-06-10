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
import { getAllSlotsTheDay, TimeSlot } from "../database/queries/scheduleQuerry";

interface Props {
  barberId: number;
  selectedDate: string;
  onSelectTime: (timeSlot: TimeSlot) => void;
  goToNext: () => void;
  goToBack: () => void;
}

export default function SelectTime({ barberId, selectedDate, onSelectTime, goToNext, goToBack }: Props) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTimeSlots = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // CORREÇÃO: Converter para data local sem considerar UTC
        const localDate = convertToLocalDate(selectedDate);
        const formattedDate = localDate.toLocaleDateString('pt-BR');
        
        const jsDayOfWeek = localDate.getDay();
        
        const slots = await getAllSlotsTheDay(barberId, jsDayOfWeek, selectedDate);
        setTimeSlots(slots);
        
        if (slots.length === 0) {
          setError(`Nenhum horário disponível para ${formattedDate}`);
        }
      } catch (error) {
        console.error("Erro ao carregar horários:", error);
        setError("Falha ao carregar horários. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    loadTimeSlots();
  }, [barberId, selectedDate]);

  // Função para converter data ISO para data local correta
  const convertToLocalDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    // Criar data no fuso horário local (Brasil)
    return new Date(year, month - 1, day);
  };

  const handleSelectTime = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    onSelectTime(slot);
  };

  const formatSelectedDate = () => {
    const dateObj = convertToLocalDate(selectedDate);
    return dateObj.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#e94560" />
          <Text style={styles.centerText}>Carregando horários...</Text>
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

    return (
      <ScrollView contentContainerStyle={styles.timeSlotsContainer}>
        {timeSlots.map((slot) => {
          const isSelected = selectedSlot?.id === slot.id;
          return (
            <Pressable
              key={slot.id}
              style={({ pressed }) => [
                styles.timeSlotButton,
                pressed && styles.buttonPressed,
                isSelected && styles.selectedTimeSlotButton
              ]}
              onPress={() => handleSelectTime(slot)}
            >
              <Text style={[
                styles.timeSlotText,
                isSelected && styles.selectedTimeSlotText
              ]}>
                {slot.time_slot}
              </Text>
              {isSelected && (
                <Ionicons 
                  name="checkmark-circle" 
                  size={24} 
                  color="#0d8b8b" 
                  style={styles.checkIcon} 
                />
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={goToBack}>
          <Ionicons name="arrow-back" size={28} color="#e94560" />
        </Pressable>
        <Text style={styles.title}>Escolha o Horário</Text>
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>
          {formatSelectedDate()}
        </Text>
      </View>

      <Text style={styles.subtitle}>Selecione um horário disponível</Text>

      {renderContent()}

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            pressed && styles.buttonPressed,
            !selectedSlot && styles.disabledButton
          ]}
          onPress={goToNext}
          disabled={!selectedSlot}
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
  dateContainer: {
    backgroundColor: '#0f3460',
    padding: 10,
    borderRadius: 8,
    marginVertical: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
    textTransform: 'capitalize',
  },
  subtitle: {
    fontSize: 16,
    color: '#f0f0f0',
    marginBottom: 15,
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
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  timeSlotButton: {
    width: '28%',
    backgroundColor: '#16213e',
    padding: 16,
    margin: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0f3460',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedTimeSlotButton: {
    backgroundColor: 'rgba(13, 139, 139, 0.3)',
    borderColor: '#0d8b8b',
  },
  timeSlotText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedTimeSlotText: {
    color: '#0d8b8b',
    fontWeight: 'bold',
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
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  checkIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
});