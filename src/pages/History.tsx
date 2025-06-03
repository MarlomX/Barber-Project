import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import db from '../database';
import { HistoryInterface, getHistoryforClientId } from '../database/queries/historyQueries';

interface Props {
  clientId: number;
  goToBack: () => void;
}

export default function HistoryScreen({ goToBack, clientId }: Props) {
  const [historyList, setHistoryList] = useState<HistoryInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const renderItem = ({ item }: { item: HistoryInterface }) => (
    <View style={styles.card}>
      <Text style={styles.row}><Text style={styles.label}>Data:</Text> {item.date}</Text>
      <Text style={styles.row}><Text style={styles.label}>Horário:</Text> {item.time}</Text>
      <Text style={styles.row}><Text style={styles.label}>Barbeiro:</Text> {item.barber}</Text>
      {/* Corrigido: item.service em vez de item.haircut */}
      <Text style={styles.row}><Text style={styles.label}>Corte:</Text> {item.service}</Text>
      <Text style={styles.row}><Text style={styles.label}>Preço:</Text> {item.price}</Text>
    </View>
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!clientId) {
          throw new Error("ID do cliente não fornecido");
        }
        
        const historyData = await getHistoryforClientId(db, clientId);
        setHistoryList(historyData);
        setError(null);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setError("Falha ao carregar histórico. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [clientId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goToBack}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Histórico de Agendamentos</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Carregando histórico...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goToBack}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Histórico de Agendamentos</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goToBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Histórico de Agendamentos</Text>
      </View>

      {historyList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum agendamento encontrado</Text>
        </View>
      ) : (
        <FlatList
          data={historyList}
          keyExtractor={(item, index) => `${item.date}-${item.time}-${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

// Estilos atualizados
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    paddingTop: StatusBar.currentHeight || 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    elevation: 4,
    zIndex: 10,
  },
  backButton: {
    padding: 6,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    fontSize: 16,
    marginBottom: 4,
    color: '#444',
  },
  label: {
    fontWeight: 'bold',
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
});