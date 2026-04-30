import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, RefreshControl, SafeAreaView, StatusBar } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api, normalizeBoolean } from "../services/api";
import { globalStyles } from "../styles/globalStyles";
import { colors, spacing, radius } from "../styles/theme";
import { useAuth } from "../context/AuthContext"; // Importação necessária

export default function Dashboard({ navigation }) {
  const { user } = useAuth(); // Acessando o perfil logado
  const [stats, setStats] = useState({ total: 0, ocupadas: 0, livres: 0 });
  const [ativas, setAtivas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const carregarDados = async () => {
    try {
      // Ajuste de chamadas conforme o perfil
      const [vagasRes, estadiasRes] = await Promise.all([
        api.get("/vagas"),
        // Se for USER, busca apenas as dele. Se for OPERADOR, busca todas.
        user.role === 'USER' ? api.get("/estadias/minhas") : api.get("/estadias/ativas")
      ]);

      const vagas = vagasRes.data.map(v => ({ ...v, ocupada: normalizeBoolean(v.ocupada) }));
      
      // Estatísticas dinâmicas
      if (user.role === 'USER') {
        setStats({
          total: ativas.length, // Total de estadias dele no histórico (exemplo)
          ocupadas: ativas.filter(e => e.ativa).length, // Reservas ativas agora
          livres: 0 // Campo ignorado para usuário comum
        });
      } else {
        setStats({
          total: vagas.length,
          ocupadas: vagas.filter(v => v.ocupada).length,
          livres: vagas.filter(v => !v.ocupada).length
        });
      }

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
  }, [carregarDados]);

  useEffect(() => {
    carregarDados();
  }, []);

  // Títulos e Labels dinâmicos baseados no UML
  const renderHeader = () => (
    <View style={[globalStyles.header, { paddingTop: insets.top + spacing.md }]}>
      <Text style={globalStyles.headerTitle}>Olá, {user?.name?.split(' ')[0]}</Text>
      <Text style={{color: colors.muted, fontSize: 14}}>
        {user.role === 'OPERADOR' ? "Painel de Controle Local" : "Minhas Reservas e Estadias"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <StatusBar barStyle="light-content" />
      {renderHeader()}

      <View style={globalStyles.container}>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.primary }]}>
            <Text style={styles.statLabel}>{user.role === 'USER' ? 'Veículos' : 'Total'}</Text>
            <Text style={styles.statValue}>{stats.total}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.danger }]}>
            <Text style={styles.statLabel}>{user.role === 'USER' ? 'Ativas' : 'Ocupadas'}</Text>
            <Text style={styles.statValue}>{stats.ocupadas}</Text>
          </View>
          {user.role !== 'USER' && (
            <View style={[styles.statCard, { backgroundColor: colors.accent }]}>
              <Text style={styles.statLabel}>Livres</Text>
              <Text style={styles.statValue}>{stats.livres}</Text>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>
          {user.role === 'USER' ? "Minha Estadia Atual" : "Estadias Ativas no Pátio"}
        </Text>

        <FlatList
          data={ativas}
          keyExtractor={(item) => String(item.id)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {user.role === 'USER' ? "Você não possui estadias ativas." : "Nenhuma estadia ativa no momento."}
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={globalStyles.card}
              onPress={() => navigation.navigate(user.role === 'USER' ? "Checkout" : "Checkout")}
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

      {/* FAB condicional: Operador faz Check-in manual, Usuário faz Reserva QR */}
      <TouchableOpacity 
        style={globalStyles.fab}
        onPress={() => navigation.navigate(user.role === 'USER' ? "Mapa" : "Checkin")}
      >
        <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold'}}>
          {user.role === 'USER' ? "Reservar" : "+"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Mantenha seus estilos originais abaixo
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.lg },
  statCard: { flex: 1, padding: spacing.md, borderRadius: radius.md, alignItems: "center", marginHorizontal: 4 },
  statLabel: { color: colors.textLight, fontSize: 12, opacity: 0.8 },
  statValue: { color: colors.textLight, fontSize: 20, fontWeight: "bold" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: colors.text, marginBottom: spacing.md },
  stayHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.xs },
  plateText: { fontSize: 18, fontWeight: "bold", color: colors.secondary },
  vagaBadge: { backgroundColor: colors.primary, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.sm },
  vagaBadgeText: { color: colors.textLight, fontSize: 12, fontWeight: "bold" },
  stayInfo: { fontSize: 14, color: colors.text, opacity: 0.7 },
  stayTime: { fontSize: 12, color: colors.muted, marginTop: 4 },
  emptyText: { textAlign: "center", color: colors.muted, marginTop: spacing.xl }
});