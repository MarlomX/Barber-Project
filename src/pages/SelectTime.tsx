import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import db from "../database";
import { getAllSlotsTheDay } from "../database/queries/scheduleQuerry";
import {TimeSlot} from "../database/queries/scheduleQuerry";

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

useEffect(() => {
  const loadTimeSlots = async () => {
    try {
      // Corrigir a interpretação da data (considerar fuso local)
      const [year, month, day] = selectedDate.split('-').map(Number);
      const localDate = new Date(year, month - 1, day);
      
      const jsDayOfWeek = localDate.getDay(); // Agora correto!
      const dbDayOfWeek = jsDayOfWeek;
      
      const slots = await getAllSlotsTheDay(db, barberId, dbDayOfWeek, selectedDate);
      setTimeSlots(slots);
    } catch (error) {
      console.error("Erro ao carregar horários:", error);
    } finally {
      setLoading(false);
    }
  };

  loadTimeSlots();
}, [barberId, selectedDate]);


  const handleSelectTime = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    onSelectTime(slot);
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
      <Text style={styles.title}>Escolha o Horário</Text>
      <Text style={styles.subtitle}>Selecione um horário disponível</Text>

      {timeSlots.length === 0 ? (
        <Text style={styles.noSlotsText}>Nenhum horário disponível para este dia.</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.timeSlotsContainer}>
          {timeSlots.map((slot) => {
            const isSelected = selectedSlot?.id === slot.id;
            return (
              <Pressable
                key={slot.id}
                style={[
                  styles.timeSlotButton,
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
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      <View style={styles.footer}>
        <Pressable
          style={[styles.continueButton, !selectedSlot && styles.disabledButton]}
          onPress={goToNext}
          disabled={!selectedSlot}
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
  noSlotsText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    marginVertical: 20,
  },
  timeSlotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  timeSlotButton: {
    width: "30%", // Três itens por linha
    backgroundColor: "#0f3460",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedTimeSlotButton: {
    backgroundColor: "#e94560",
    borderWidth: 2,
    borderColor: "#fff",
  },
  timeSlotText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedTimeSlotText: {
    color: "#fff",
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