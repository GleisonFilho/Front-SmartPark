import React, { useEffect, useState, useCallback } from "react";
<<<<<<< HEAD
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet, RefreshControl, SafeAreaView, ActivityIndicator } from "react-native";
=======
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet, RefreshControl, SafeAreaView } from "react-native";
>>>>>>> 0726f64c57c1433dbfe11c155c9ab4433a111e40
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api, normalizeBoolean } from "../services/api";
import { globalStyles } from "../styles/globalStyles";
import { colors, spacing, radius } from "../styles/theme";
<<<<<<< HEAD
import { useAuth } from "../context/AuthContext"; // Importado para gerenciar perfis e logout

export default function Checkout() {
  const { user, signOut } = useAuth(); // Pegamos o user e a função de sair
=======

export default function Checkout() {
>>>>>>> 0726f64c57c1433dbfe11c155c9ab4433a111e40
  const [ativas, setAtivas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const carregar = async () => {
    try {
<<<<<<< HEAD
      // Se for USER, o backend deve filtrar por 'minhas'. Se for OPERADOR, traz todas.
      const endpoint = user.role === 'USER' ? "/estadias/minhas" : "/estadias/ativas";
      const res = await api.get(endpoint);
      
=======
      const res = await api.get("/estadias/ativas");
>>>>>>> 0726f64c57c1433dbfe11c155c9ab4433a111e40
      const data = res.data?.content ?? res.data ?? [];
      setAtivas(data.map(e => ({
        ...e,
        ativa: normalizeBoolean(e.ativa),
        vaga: e.vaga ? { ...e.vaga, ocupada: normalizeBoolean(e.vaga.ocupada) } : null
      })));
<<<<<<< HEAD
    } catch (err) { 
      console.log("Erro ao carregar estadias", err); 
    }
=======
    } catch { console.log("Erro ao carregar"); }
>>>>>>> 0726f64c57c1433dbfe11c155c9ab4433a111e40
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    carregar().then(() => setRefreshing(false));
  }, []);

<<<<<<< HEAD
  const handleLogout = () => {
    Alert.alert("Sair", "Deseja realmente encerrar sua sessão?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", onPress: () => signOut() }
    ]);
  };

  const finalizar = async (id) => {
    try {
      // 1. Calcular Valor
=======
  const finalizar = async (id) => {
    try {
>>>>>>> 0726f64c57c1433dbfe11c155c9ab4433a111e40
      const valorRes = await api.get(`/estadias/${id}/valor`);
      const valor = valorRes.data;

      Alert.alert(
        "Finalizar Estadia",
<<<<<<< HEAD
        `Valor total: R$ ${valor.toFixed(2)}\n\nDeseja realizar o pagamento e liberar a vaga?`,
        [
          { text: "Voltar", style: "cancel" },
          { 
            text: "Pagar e Sair", 
            onPress: async () => {
              // 2. Realizar Pagamento e Check-out
              await api.put(`/estadias/${id}/finalizar`);
              Alert.alert("Sucesso", "Pagamento aprovado e vaga liberada!");
=======
        `Valor total: R$ ${valor.toFixed(2)}\nDeseja confirmar o pagamento?`,
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Confirmar", 
            onPress: async () => {
              await api.put(`/estadias/${id}/finalizar`);
              Alert.alert("Sucesso", "Checkout realizado!");
>>>>>>> 0726f64c57c1433dbfe11c155c9ab4433a111e40
              carregar();
            }
          }
        ]
      );
<<<<<<< HEAD
    } catch { 
      Alert.alert("Erro", "Não foi possível processar o pagamento."); 
    }
=======
    } catch { Alert.alert("Erro", "Falha ao processar checkout"); }
>>>>>>> 0726f64c57c1433dbfe11c155c9ab4433a111e40
  };

  useEffect(() => { carregar(); }, []);

  return (
    <SafeAreaView style={globalStyles.safeArea}>
<<<<<<< HEAD
      <View style={[globalStyles.header, { paddingTop: insets.top + spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg }]}>
        <Text style={globalStyles.headerTitle}>
            {user.role === 'USER' ? "Minha Estadia" : "Checkout"}
        </Text>
        
        {/* Botão de Logout adicionado conforme necessidade de navegação */}
        <TouchableOpacity onPress={handleLogout}>
            <Text style={{color: colors.danger, fontWeight: 'bold'}}>Sair</Text>
        </TouchableOpacity>
=======
      <View style={[globalStyles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={globalStyles.headerTitle}>Checkout</Text>
>>>>>>> 0726f64c57c1433dbfe11c155c9ab4433a111e40
      </View>

      <View style={globalStyles.container}>
        <FlatList
          data={ativas}
          keyExtractor={item => String(item.id)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
<<<<<<< HEAD
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
                    {user.role === 'USER' ? "Pagar e Sair" : "Calcular e Finalizar"}
                </Text>
=======
          renderItem={({ item }) => (
            <View style={globalStyles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.plateText}>{item?.veiculo?.placa}</Text>
                <Text style={styles.vagaText}>Vaga {item?.vaga?.codigo}</Text>
              </View>
              <Text style={styles.infoText}>Entrada: {new Date(item.entrada).toLocaleString()}</Text>
              
              <TouchableOpacity onPress={() => finalizar(item.id)} style={[globalStyles.button, styles.btnFinalizar]}>
                <Text style={globalStyles.buttonText}>Calcular e Finalizar</Text>
>>>>>>> 0726f64c57c1433dbfe11c155c9ab4433a111e40
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
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
=======
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  plateText: { fontSize: 20, fontWeight: "bold", color: colors.secondary },
  vagaText: { fontSize: 16, color: colors.primary, fontWeight: "bold" },
  infoText: { fontSize: 14, color: colors.muted, marginBottom: 15 },
  btnFinalizar: { backgroundColor: colors.danger },
});
>>>>>>> 0726f64c57c1433dbfe11c155c9ab4433a111e40
