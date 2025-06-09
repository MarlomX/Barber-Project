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
import { getDayOfWeekDisponible } from "../database/queries/scheduleQuerry";

interface Props {
  barberId: number;
  onSelectDate: (date: string) => void;
  goToNext: () => void;
  goToBack: () => void;
}

export default function SelectDate({ barberId, onSelectDate, goToNext, goToBack }: Props) {
  const [availableDays, setAvailableDays] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAvailableDays = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const days = await getDayOfWeekDisponible(db, barberId);
        setAvailableDays(days || []);
      } catch (error) {
        console.error("Erro ao carregar dias disponíveis:", error);
        setError("Falha ao carregar dias disponíveis. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    loadAvailableDays();
  }, [barberId]);

  const handleSelectDay = (dayIndex: number) => {
    if (availableDays.includes(dayIndex)) {
      const selected = getFullDateForDay(dayIndex);
      setSelectedDate(selected);
      onSelectDate(selected);
    }
  };

  // Função para obter o nome do dia
  const getDayName = (dayIndex: number) => {
    const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    return days[dayIndex];
  };

  const getFullDateForDay = (dayIndex: number): string => {
    const today = new Date();
    const currentDay = today.getDay();
    
    // Calcula a diferença correta considerando a rotação semanal
    let diff = dayIndex - currentDay;
    if (diff < 0) {
      diff += 7;
    }
    
    // Se for domingo (0) e hoje for sábado (6), avança 1 dia
    if (currentDay === 6 && dayIndex === 0) {
      diff = 1;
    }
    
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);
    
    const year = targetDate.getFullYear();
    const month = (targetDate.getMonth() + 1).toString().padStart(2, '0');
    const day = targetDate.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  // Função para exibir a data formatada (DD/MM)
  const getDisplayDate = (dayIndex: number): string => {
    const fullDate = getFullDateForDay(dayIndex);
    const [year, month, day] = fullDate.split('-');
    return `${day}/${month}`;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#e94560" />
          <Text style={styles.centerText}>Carregando dias disponíveis...</Text>
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

    if (availableDays.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Nenhum dia disponível neste momento</Text>
        </View>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.daysContainer}>
        {[0, 1, 2, 3, 4, 5, 6].map((day) => {
          const isAvailable = availableDays.includes(day);
          const isSelected = selectedDate === getFullDateForDay(day);
          
          return (
            <Pressable
              key={day}
              style={({ pressed }) => [
                styles.dayButton,
                pressed && isAvailable && styles.buttonPressed,
                isSelected && styles.selectedDayButton,
                !isAvailable && styles.disabledDayButton
              ]}
              onPress={() => handleSelectDay(day)}
              disabled={!isAvailable}
            >
              <Text style={[
                styles.dayText,
                isSelected && styles.selectedDayText,
                !isAvailable && styles.disabledText
              ]}>
                {getDayName(day)}
              </Text>
              <Text style={[
                styles.dateText,
                isSelected && styles.selectedDateText,
                !isAvailable && styles.disabledDateText
              ]}>
                {getDisplayDate(day)}
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
        <Text style={styles.title}>Escolha o Dia</Text>
      </View>

      <Text style={styles.subtitle}>Selecione um dia disponível</Text>

      {renderContent()}

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            pressed && styles.buttonPressed,
            !selectedDate && styles.disabledButton
          ]}
          onPress={goToNext}
          disabled={!selectedDate}
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
  subtitle: {
    fontSize: 16,
    color: '#f0f0f0',
    marginVertical: 15,
    textAlign: 'center',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  dayButton: {
    width: '48%',
    backgroundColor: '#16213e',
    padding: 18,
    marginVertical: 8,
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
  selectedDayButton: {
    backgroundColor: 'rgba(13, 139, 139, 0.3)',
    borderColor: '#0d8b8b',
  },
  disabledDayButton: {
    backgroundColor: '#1a1a2e',
    borderColor: '#2c2c54',
  },
  dayText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
  },
  dateText: {
    color: '#ccc',
    fontSize: 15,
    marginTop: 4,
  },
  selectedDayText: {
    color: '#0d8b8b',
    fontWeight: 'bold',
  },
  selectedDateText: {
    color: '#0d8b8b',
  },
  disabledText: {
    color: '#555',
  },
  disabledDateText: {
    color: '#555',
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
    top: 8,
    right: 8,
  },
});