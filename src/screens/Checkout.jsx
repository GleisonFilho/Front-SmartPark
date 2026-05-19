import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet, RefreshControl, SafeAreaView, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api, normalizeBoolean } from "../services/api";
import { globalStyles } from "../styles/globalStyles";
import { colors, spacing, radius } from "../styles/theme";
import { useAuth } from "../context/AuthContext"; 

export default function Checkout() {
  const { user, signOut } = useAuth(); 
  const [ativas, setAtivas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const carregar = async () => {
    try {
      // Filtra o endpoint com base no tipo de perfil (Cliente ou Operador)
      const endpoint = user?.role === 'USER' ? "/estadias/minhas" : "/estadias/ativas";
      const res = await api.get(endpoint);
      
      const data = res.data?.content ?? res.data ?? [];
      setAtivas(data.map(e => ({
        ...e,
        ativa: normalizeBoolean(e.ativa),
        vaga: e.vaga ? { ...e.vaga, ocupada: normalizeBoolean(e.vaga.ocupada) } : null
      })));
    } catch (err) { 
      console.log("Erro ao carregar estadias", err); 
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    carregar().then(() => setRefreshing(false));
  }, []);

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja realmente encerrar sua sessão?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", onPress: () => signOut() }
    ]);
  };

  const finalizar = async (id) => {
    try {
      // 1. Busca o cálculo do valor gerado pela estadia no Back-end
      const valorRes = await api.get(`/estadias/${id}/valor`);
      const valor = valorRes.data;

      Alert.alert(
        "Finalizar Estadia",
        `Valor total: R$ ${valor.toFixed(2)}\n\nDeseja realizar o pagamento e liberar a vaga?`,
        [
          { text: "Voltar", style: "cancel" },
          { 
            text: "Pagar e Sair", 
            onPress: async () => {
              // 2. Realiza o encerramento da estadia e libera o status da vaga
              await api.put(`/estadias/${id}/finalizar`);
              Alert.alert("Sucesso", "Pagamento aprovado e vaga liberada!");
              carregar();
            }
          }
        ]
      );
    } catch { 
      Alert.alert("Erro", "Não foi possível processar o pagamento."); 
    }
  };

  useEffect(() => { carregar(); }, []);

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={[globalStyles.header, { paddingTop: insets.top + spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg }]}>
        <Text style={globalStyles.headerTitle}>
            {user?.role === 'USER' ? "Minha Estadia" : "Checkout"}
        </Text>
        
        <TouchableOpacity onPress={handleLogout}>
            <Text style={{color: colors.danger, fontWeight: 'bold'}}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={globalStyles.container}>
        <FlatList
          data={ativas}
          keyExtractor={item => String(item.id)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Não há estadias para finalizar no momento.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={globalStyles.card}>
              <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.plateText}>{item?.veiculo?.placa}</Text>
                    <Text style={styles.modelText}>{item?.veiculo?.modelo}</Text>
                </View>
                <View style={styles.vagaBadge}>
                    <Text style={styles.vagaText}>Vaga {item?.vaga?.codigo}</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Entrada:</Text>
                <Text style={styles.infoValue}>{new Date(item.entrada).toLocaleString()}</Text>
              </View>
              
              <TouchableOpacity 
                onPress={() => finalizar(item.id)} 
                style={[globalStyles.button, styles.btnFinalizar]}
              >
                <Text style={globalStyles.buttonText}>
                    {user?.role === 'USER' ? "Pagar e Sair" : "Calcular e Finalizar"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 15 },
  plateText: { fontSize: 22, fontWeight: "bold", color: colors.secondary },
  modelText: { fontSize: 14, color: colors.muted },
  vagaBadge: { backgroundColor: colors.primary + '20', padding: 6, borderRadius: radius.sm },
  vagaText: { fontSize: 14, color: colors.primary, fontWeight: "bold" },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  infoLabel: { fontSize: 14, color: colors.muted },
  infoValue: { fontSize: 14, color: colors.text, fontWeight: '500' },
  btnFinalizar: { backgroundColor: colors.primary, marginTop: 10 },
  emptyContainer: { flex: 1, alignItems: 'center', marginTop: 50 },
  emptyText: { color: colors.muted, fontSize: 16 }
});