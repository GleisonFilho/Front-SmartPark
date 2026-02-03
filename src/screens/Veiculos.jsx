import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet, RefreshControl, SafeAreaView } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api, normalizeBoolean } from "../services/api";
import { globalStyles } from "../styles/globalStyles";
import { colors, spacing, radius } from "../styles/theme";

export default function Veiculos() {
  const [form, setForm] = useState({ placa: "", modelo: "", cor: "", tipo: "CARRO" });
  const [veiculos, setVeiculos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const carregarVeiculos = async () => {
    try {
      const response = await api.get("/veiculos");
      setVeiculos(response.data.map(v => ({ ...v, ativo: normalizeBoolean(v.ativo) })));
    } catch (e) { console.log(e); }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    carregarVeiculos().then(() => setRefreshing(false));
  }, []);

  const cadastrar = async () => {
    if (!form.placa || !form.modelo) return Alert.alert("Atenção", "Preencha os campos obrigatórios");
    try {
      await api.post("/veiculos", { ...form, placa: form.placa.toUpperCase() });
      setForm({ placa: "", modelo: "", cor: "", tipo: "CARRO" });
      carregarVeiculos();
      Alert.alert("Sucesso", "Veículo cadastrado");
    } catch (e) { Alert.alert("Erro", "Falha ao cadastrar"); }
  };

  useEffect(() => { carregarVeiculos(); }, []);

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={[globalStyles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={globalStyles.headerTitle}>Veículos</Text>
      </View>

      <View style={globalStyles.container}>
        <View style={globalStyles.card}>
          <TextInput placeholder="Placa" value={form.placa} onChangeText={t => setForm({...form, placa: t})} autoCapitalize="characters" style={globalStyles.input} />
          <TextInput placeholder="Modelo" value={form.modelo} onChangeText={t => setForm({...form, modelo: t})} style={globalStyles.input} />
          <TextInput placeholder="Cor" value={form.cor} onChangeText={t => setForm({...form, cor: t})} style={globalStyles.input} />
          
          <View style={styles.tipoRow}>
            {["CARRO", "MOTO"].map(t => (
              <TouchableOpacity key={t} onPress={() => setForm({...form, tipo: t})} style={[styles.tipoBtn, form.tipo === t && styles.tipoBtnActive]}>
                <Text style={[styles.tipoBtnText, form.tipo === t && styles.tipoBtnTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={cadastrar} style={globalStyles.button}>
            <Text style={globalStyles.buttonText}>Cadastrar Veículo</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={veiculos}
          keyExtractor={(item) => String(item.id)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <View style={globalStyles.card}>
              <View style={styles.veiculoHeader}>
                <Text style={styles.veiculoPlaca}>{item.placa}</Text>
                <Text style={styles.veiculoTipo}>{item.tipo}</Text>
              </View>
              <Text style={styles.veiculoInfo}>{item.modelo} • {item.cor}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tipoRow: { flexDirection: "row", marginBottom: spacing.md },
  tipoBtn: { flex: 1, padding: 12, alignItems: "center", borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, marginHorizontal: 4 },
  tipoBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tipoBtnText: { color: colors.text, fontWeight: "bold" },
  tipoBtnTextActive: { color: colors.textLight },
  veiculoHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  veiculoPlaca: { fontSize: 18, fontWeight: "bold", color: colors.secondary },
  veiculoTipo: { fontSize: 12, color: colors.primary, fontWeight: "bold" },
  veiculoInfo: { fontSize: 14, color: colors.text, opacity: 0.7 }
});
