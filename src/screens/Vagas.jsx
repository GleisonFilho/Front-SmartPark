import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, RefreshControl, SafeAreaView, StatusBar } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api, normalizeBoolean } from "../services/api";
import { globalStyles } from "../styles/globalStyles";
import { colors, spacing, radius } from "../styles/theme";

export default function Vagas() {
  const [codigo, setCodigo] = useState("");
  const [vagas, setVagas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const carregarVagas = async () => {
    try {
      const res = await api.get("/vagas");
      const normalizadas = res.data.map(v => ({
        ...v,
        ocupada: normalizeBoolean(v.ocupada)
      }));
      // Ordena as vagas alfanumericamente por código (ex: A-01, A-02, B-01)
      setVagas(normalizadas.sort((a, b) => a.codigo.localeCompare(b.codigo)));
    } catch (err) {
      console.log("Erro ao carregar vagas", err);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    carregarVagas().then(() => setRefreshing(false));
  }, []);

  const cadastrarVaga = async () => {
    if (!codigo) return Alert.alert("Atenção", "Informe o código da vaga");
    try {
      await api.post("/vagas", { codigo: codigo.toUpperCase().trim(), ocupada: false });
      Alert.alert("Sucesso", "Vaga cadastrada com sucesso!");
      setCodigo("");
      carregarVagas();
    } catch (err) {
      Alert.alert("Erro", "Falha ao cadastrar vaga. Verifique se o código já existe.");
    }
  };

  const deletarVaga = (id, codigoVaga) => {
    Alert.alert(
      "Excluir Vaga",
      `Deseja remover permanentemente a vaga ${codigoVaga}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: async () => {
            try {
              await api.delete(`/vagas/${id}`);
              carregarVagas();
            } catch (err) {
              Alert.alert("Erro", "Não é possível excluir uma vaga que está ocupada ou vinculada a históricos.");
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    carregarVagas();
  }, []);

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={[globalStyles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={globalStyles.headerTitle}>Gestão de Vagas</Text>
      </View>

      <View style={globalStyles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={[globalStyles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Novo Código (ex: B-05)"
            placeholderTextColor={colors.muted}
            value={codigo}
            onChangeText={setCodigo}
            autoCapitalize="characters"
          />
          <TouchableOpacity style={styles.addButton} onPress={cadastrarVaga}>
            <Text style={globalStyles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={vagas}
          numColumns={3}
          keyExtractor={(item) => String(item.id)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          columnWrapperStyle={styles.gridRow}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma vaga cadastrada.</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.vagaItem, { backgroundColor: item.ocupada ? colors.danger : colors.accent }]}
              onLongPress={() => deletarVaga(item.id, item.codigo)}
              activeOpacity={0.7}
            >
              <Text style={styles.vagaText}>{item.codigo}</Text>
              <Text style={styles.vagaStatus}>{item.ocupada ? "Ocupada" : "Livre"}</Text>
            </TouchableOpacity>
          )}
        />
        
        <Text style={styles.hintText}>Pressione e segure um card para excluir a vaga.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    marginBottom: spacing.lg,
    alignItems: "center",
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    height: 54,
    borderRadius: radius.md,
    justifyContent: "center",
    marginLeft: spacing.sm,
    elevation: 2,
  },
  gridRow: {
    justifyContent: "flex-start",
  },
  vagaItem: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
    margin: '1.5%',
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  vagaText: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: "bold",
  },
  vagaStatus: {
    color: colors.textLight,
    fontSize: 10,
    marginTop: 4,
    opacity: 0.8,
  },
  emptyText: {
    textAlign: "center",
    color: colors.muted,
    marginTop: spacing.xl,
  },
  hintText: {
    textAlign: "center",
    color: colors.muted,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: spacing.md,
    marginBottom: spacing.sm
  }
});