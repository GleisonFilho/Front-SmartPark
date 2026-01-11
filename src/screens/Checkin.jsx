import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, FlatList, SafeAreaView } from "react-native";
import { api, normalizeBoolean } from "../services/api";
import { globalStyles } from "../styles/globalStyles";
import { colors, spacing, radius } from "../styles/theme";

export default function Checkin({ navigation }) {
  const [placa, setPlaca] = useState("");
  const [codigoVaga, setCodigoVaga] = useState("");
  const [vagasLivres, setVagasLivres] = useState([]);

  useEffect(() => {
    carregarVagas();
  }, []);

  async function carregarVagas() {
    try {
      const res = await api.get("/vagas");
      setVagasLivres(res.data.filter(v => !normalizeBoolean(v.ocupada)));
    } catch (e) { console.log(e); }
  }

  async function iniciar() {
    if (!placa || !codigoVaga) return Alert.alert("Atenção", "Preencha todos os campos");
    try {
      const [veiculosRes, vagasRes] = await Promise.all([api.get("/veiculos"), api.get("/vagas")]);
      const veiculo = veiculosRes.data.find(v => v.placa === placa.toUpperCase().trim());
      const vaga = vagasRes.data.find(v => v.codigo === codigoVaga.toUpperCase().trim());

      if (!veiculo) return Alert.alert("Erro", "Veículo não cadastrado");
      if (!vaga) return Alert.alert("Erro", "Vaga não encontrada");

      await api.post("/estadias", null, { params: { veiculoId: veiculo.id, vagaId: vaga.id } });
      Alert.alert("Sucesso", "Check-in realizado!");
      navigation.goBack();
    } catch (e) { Alert.alert("Erro", "Falha ao iniciar estadia"); }
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerTitle}>Check-in</Text>
      </View>

      <View style={globalStyles.container}>
        <View style={globalStyles.card}>
          <Text style={styles.label}>Placa do Veículo</Text>
          <TextInput placeholder="ABC1234" value={placa} onChangeText={setPlaca} autoCapitalize="characters" style={globalStyles.input} />
          
          <Text style={styles.label}>Código da Vaga</Text>
          <TextInput placeholder="A-01" value={codigoVaga} onChangeText={setCodigoVaga} autoCapitalize="characters" style={globalStyles.input} />

          <TouchableOpacity onPress={iniciar} style={globalStyles.button}>
            <Text style={globalStyles.buttonText}>Confirmar Entrada</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Vagas Disponíveis</Text>
        <FlatList
          data={vagasLivres}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.vagaBadge} onPress={() => setCodigoVaga(item.codigo)}>
              <Text style={styles.vagaBadgeText}>{item.codigo}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, fontWeight: "bold", color: colors.muted, marginBottom: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: colors.text, marginTop: spacing.lg, marginBottom: spacing.md },
  vagaBadge: { backgroundColor: colors.accent, paddingHorizontal: 20, paddingVertical: 12, borderRadius: radius.md, marginRight: 10 },
  vagaBadgeText: { color: colors.textLight, fontWeight: "bold" }
});
