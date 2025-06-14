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
      <View style={styles.cardHeader}>
        <Text style={styles.cardDate}>{item.date}</Text>
        <Text style={styles.cardTime}>{item.time}</Text>
      </View>
      
      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Barbeiro:</Text>
          <Text style={styles.infoValue}>{item.barber}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Corte:</Text>
          <Text style={styles.infoValue}>{item.service}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Preço:</Text>
          <Text style={[styles.infoValue, styles.priceText]}>R$ {item.price}</Text>
        </View>
      </View>
    </View>
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!clientId) {
          throw new Error("ID do cliente não fornecido");
        }
        
        const historyData = await getHistoryforClientId(clientId);
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

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#e94560" />
          <Text style={styles.centerText}>Carregando histórico...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (historyList.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Nenhum agendamento encontrado</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={historyList}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goToBack}>
          <Ionicons name="arrow-back" size={24} color="#e94560" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Histórico de Agendamentos</Text>
      </View>

      {renderContent()}
    </SafeAreaView>
  );
}

// Estilos atualizados com a paleta de cores
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    paddingTop: StatusBar.currentHeight || 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#16213e",
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  backButton: {
    padding: 6,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "#16213e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#e94560',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
    paddingBottom: 10,
    marginBottom: 12,
  },
  cardDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  cardTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0d8b8b', // Turquesa para contraste
  },
  cardBody: {
    paddingHorizontal: 5,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#e94560',
    width: 80,
  },
  infoValue: {
    flex: 1,
    color: '#f0f0f0',
  },
  priceText: {
    fontWeight: 'bold',
    color: '#0d8b8b',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  centerText: {
    color: '#f0f0f0',
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: '#e94560',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    fontWeight: '500',
  },
});