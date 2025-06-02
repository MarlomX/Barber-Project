import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
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

  useEffect(() => {
    const loadAvailableDays = async () => {
      try {
        const days = await getDayOfWeekDisponible(db, barberId);
        setAvailableDays(days || []);
      } catch (error) {
        console.error("Erro ao carregar dias disponíveis:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAvailableDays();
  }, [barberId]);

  const handleSelectDay = (dayIndex: number) => {
    if (availableDays.includes(dayIndex)) {
      const selectedDate = getFullDateForDay(dayIndex);
      setSelectedDate(selectedDate);
      onSelectDate(selectedDate);
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

  // Função para calcular a data correspondente ao dia da semana
  const getDateForDay = (dayIndex: number): string => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 (domingo) - 6 (sábado)
    
    // Calcula a diferença de dias
    let diff = dayIndex - currentDay;
    if (diff < 0) {
      diff += 7; // Vai para a próxima semana
    }
    
    // Cria a data alvo
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);
    
    // Formata a data como DD/MM
    const day = targetDate.getDate().toString().padStart(2, '0');
    const month = (targetDate.getMonth() + 1).toString().padStart(2, '0');
    
    return `${day}/${month}`;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#e94560" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha o Dia</Text>
      <Text style={styles.subtitle}>Selecione um dia disponível</Text>

      <ScrollView contentContainerStyle={styles.daysContainer}>
        {[0, 1, 2, 3, 4, 5, 6].map((day) => {
          const isAvailable = availableDays.includes(day);
          const isSelected = selectedDate === getFullDateForDay(day);
          
          return (
            <Pressable
              key={day}
              style={[
                styles.dayButton,
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
                {getDateForDay(day)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.continueButton, !selectedDate && styles.disabledButton]}
          onPress={goToNext}
          disabled={!selectedDate}
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
    flex: 1,
    padding: 20,
    backgroundColor: "#1a1a2e",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "#e94560",
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dayButton: {
    width: "48%",
    backgroundColor: "#0f3460",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedDayButton: {
    backgroundColor: "#e94560",
    borderWidth: 2,
    borderColor: "#fff",
  },
  disabledDayButton: {
    backgroundColor: "#2c2c54",
    opacity: 0.6,
  },
  dayText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dateText: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 4,
  },
  selectedDayText: {
    color: "#fff",
  },
  selectedDateText: {
    color: "#fff",
  },
  disabledText: {
    color: "#aaa",
    textDecorationLine: "line-through",
  },
  disabledDateText: {
    color: "#777",
    textDecorationLine: "line-through",
  },
  footer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#0f3460",
  },
  continueButton: {
    backgroundColor: "#109c06",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
  },
  backButton: {
    backgroundColor: "#ff4444",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});