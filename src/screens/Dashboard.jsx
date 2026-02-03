import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, RefreshControl, SafeAreaView, StatusBar } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api, normalizeBoolean } from "../services/api";
import { globalStyles } from "../styles/globalStyles";
import { colors, spacing, radius } from "../styles/theme";

export default function Dashboard({ navigation }) {
  const [stats, setStats] = useState({ total: 0, ocupadas: 0, livres: 0 });
  const [ativas, setAtivas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const carregarDados = async () => {
    try {
      const [vagasRes, estadiasRes] = await Promise.all([
        api.get("/vagas"),
        api.get("/estadias/ativas")
      ]);

      const vagas = vagasRes.data.map(v => ({ ...v, ocupada: normalizeBoolean(v.ocupada) }));
      setStats({
        total: vagas.length,
        ocupadas: vagas.filter(v => v.ocupada).length,
        livres: vagas.filter(v => !v.ocupada).length
      });

      const estadias = (estadiasRes.data?.content ?? estadiasRes.data ?? []).map(e => ({
        ...e,
        ativa: normalizeBoolean(e.ativa),
        vaga: e.vaga ? { ...e.vaga, ocupada: normalizeBoolean(e.vaga.ocupada) } : null
      }));
      setAtivas(estadias);
    } catch (err) {
      console.log("Erro ao carregar dashboard", err);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    carregarDados().then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={[globalStyles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={globalStyles.headerTitle}>SmartPark</Text>
        <Text style={{color: colors.muted, fontSize: 14}}>Gerenciamento de Estacionamento</Text>
      </View>

      <View style={globalStyles.container}>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.primary }]}>
            <Text style={styles.statLabel}>Total</Text>
            <Text style={styles.statValue}>{stats.total}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.danger }]}>
            <Text style={styles.statLabel}>Ocupadas</Text>
            <Text style={styles.statValue}>{stats.ocupadas}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.accent }]}>
            <Text style={styles.statLabel}>Livres</Text>
            <Text style={styles.statValue}>{stats.livres}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Estadias Ativas</Text>

        <FlatList
          data={ativas}
          keyExtractor={(item) => String(item.id)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma estadia ativa.</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={globalStyles.card}
              onPress={() => navigation.navigate("Checkout")}
            >
              <View style={styles.stayHeader}>
                <Text style={styles.plateText}>{item.veiculo?.placa}</Text>
                <View style={styles.vagaBadge}>
                  <Text style={styles.vagaBadgeText}>{item.vaga?.codigo}</Text>
                </View>
              </View>
              <Text style={styles.stayInfo}>{item.veiculo?.modelo} • {item.veiculo?.cor}</Text>
              <Text style={styles.stayTime}>Entrada: {new Date(item.entrada).toLocaleTimeString()}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <TouchableOpacity 
        style={globalStyles.fab}
        onPress={() => navigation.navigate("Checkin")}
      >
        <Text style={{color: '#fff', fontSize: 30}}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
    marginHorizontal: 4,
  },
  statLabel: {
    color: colors.textLight,
    fontSize: 12,
    opacity: 0.8,
  },
  statValue: {
    color: colors.textLight,
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.md,
  },
  stayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  plateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.secondary,
  },
  vagaBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  vagaBadgeText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: "bold",
  },
  stayInfo: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
  },
  stayTime: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 4,
  },
  emptyText: {
    textAlign: "center",
    color: colors.muted,
    marginTop: spacing.xl,
  }
});
