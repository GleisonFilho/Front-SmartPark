import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet, RefreshControl, SafeAreaView } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api, normalizeBoolean } from "../services/api";
import { globalStyles } from "../styles/globalStyles";
import { colors, spacing, radius } from "../styles/theme";

export default function Checkout() {
  const [ativas, setAtivas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const carregar = async () => {
    try {
      const res = await api.get("/estadias/ativas");
      const data = res.data?.content ?? res.data ?? [];
      setAtivas(data.map(e => ({
        ...e,
        ativa: normalizeBoolean(e.ativa),
        vaga: e.vaga ? { ...e.vaga, ocupada: normalizeBoolean(e.vaga.ocupada) } : null
      })));
    } catch { console.log("Erro ao carregar"); }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    carregar().then(() => setRefreshing(false));
  }, []);

  const finalizar = async (id) => {
    try {
      const valorRes = await api.get(`/estadias/${id}/valor`);
      const valor = valorRes.data;

      Alert.alert(
        "Finalizar Estadia",
        `Valor total: R$ ${valor.toFixed(2)}\nDeseja confirmar o pagamento?`,
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Confirmar", 
            onPress: async () => {
              await api.put(`/estadias/${id}/finalizar`);
              Alert.alert("Sucesso", "Checkout realizado!");
              carregar();
            }
          }
        ]
      );
    } catch { Alert.alert("Erro", "Falha ao processar checkout"); }
  };

  useEffect(() => { carregar(); }, []);

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={[globalStyles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={globalStyles.headerTitle}>Checkout</Text>
      </View>

      <View style={globalStyles.container}>
        <FlatList
          data={ativas}
          keyExtractor={item => String(item.id)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <View style={globalStyles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.plateText}>{item?.veiculo?.placa}</Text>
                <Text style={styles.vagaText}>Vaga {item?.vaga?.codigo}</Text>
              </View>
              <Text style={styles.infoText}>Entrada: {new Date(item.entrada).toLocaleString()}</Text>
              
              <TouchableOpacity onPress={() => finalizar(item.id)} style={[globalStyles.button, styles.btnFinalizar]}>
                <Text style={globalStyles.buttonText}>Calcular e Finalizar</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  plateText: { fontSize: 20, fontWeight: "bold", color: colors.secondary },
  vagaText: { fontSize: 16, color: colors.primary, fontWeight: "bold" },
  infoText: { fontSize: 14, color: colors.muted, marginBottom: 15 },
  btnFinalizar: { backgroundColor: colors.danger },
});
