import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, RefreshControl, SafeAreaView } from "react-native";
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
      setVagas(normalizadas);
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
      await api.post("/vagas", { codigo: codigo.toUpperCase() });
      Alert.alert("Sucesso", "Vaga cadastrada");
      setCodigo("");
      carregarVagas();
    } catch (err) {
      Alert.alert("Erro", "Falha ao cadastrar vaga");
    }
  };

  useEffect(() => {
    carregarVagas();
  }, []);

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={[globalStyles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={globalStyles.headerTitle}>Vagas</Text>
      </View>

      <View style={globalStyles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={[globalStyles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Código (ex: A-01)"
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
          renderItem={({ item }) => (
            <View style={[styles.vagaItem, { backgroundColor: item.ocupada ? colors.danger : colors.accent }]}>
              <Text style={styles.vagaText}>{item.codigo}</Text>
              <Text style={styles.vagaStatus}>{item.ocupada ? "Ocupada" : "Livre"}</Text>
            </View>
          )}
        />
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
    elevation: 2,
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
  }
});
