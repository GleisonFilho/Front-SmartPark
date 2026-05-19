import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from "react-native";
import { useRoute } from '@react-navigation/native'; // Importante para receber dados do Scanner
=======
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, FlatList, SafeAreaView } from "react-native";
>>>>>>> 0726f64c57c1433dbfe11c155c9ab4433a111e40
import { api, normalizeBoolean } from "../services/api";
import { globalStyles } from "../styles/globalStyles";
import { colors, spacing, radius } from "../styles/theme";

export default function Checkin({ navigation }) {
<<<<<<< HEAD
  const route = useRoute();
  const [placa, setPlaca] = useState("");
  const [codigoVaga, setCodigoVaga] = useState("");
  const [vagasLivres, setVagasLivres] = useState([]);
  const [loading, setLoading] = useState(false);

  // Efeito para capturar o QR Code vindo do Scanner
  useEffect(() => {
    if (route.params?.qrCodeVaga) {
      setCodigoVaga(route.params.qrCodeVaga);
    }
  }, [route.params?.qrCodeVaga]);
=======
  const [placa, setPlaca] = useState("");
  const [codigoVaga, setCodigoVaga] = useState("");
  const [vagasLivres, setVagasLivres] = useState([]);
>>>>>>> 0726f64c57c1433dbfe11c155c9ab4433a111e40

  useEffect(() => {
    carregarVagas();
  }, []);

  async function carregarVagas() {
    try {
      const res = await api.get("/vagas");
<<<<<<< HEAD
      // Filtra apenas as que não estão ocupadas conforme o UML
      setVagasLivres(res.data.filter(v => !normalizeBoolean(v.ocupada)));
    } catch (e) {
      console.log("Erro ao carregar vagas:", e);
    }
  }

  async function iniciar() {
    if (!placa || !codigoVaga) {
      return Alert.alert("Atenção", "Preencha a placa e selecione uma vaga.");
    }

    setLoading(true);
    try {
      // 1. Busca o veículo pela placa específica (mais eficiente que listar todos)
      const veiculoRes = await api.get(`/veiculos/placa/${placa.toUpperCase().trim()}`);
      const veiculo = veiculoRes.data;

      // 2. Busca a vaga pelo código
      const vagasRes = await api.get("/vagas");
      const vaga = vagasRes.data.find(v => v.codigo === codigoVaga.toUpperCase().trim());

      if (!veiculo) {
        setLoading(false);
        return Alert.alert("Erro", "Veículo não encontrado. Cadastre-o primeiro.");
      }
      if (!vaga) {
        setLoading(false);
        return Alert.alert("Erro", "Vaga não encontrada ou inválida.");
      }

      // 3. Realiza o Check-in (Cria a estadia) conforme o diagrama UML
      await api.post("/estadias", null, { 
        params: { veiculoId: veiculo.id, vagaId: vaga.id } 
      });

      Alert.alert("Sucesso", "Check-in realizado! A vaga agora está ocupada.");
      navigation.navigate("Main"); // Volta para o Dashboard atualizado
    } catch (e) {
      console.log(e);
      Alert.alert("Erro", "Falha ao iniciar estadia. Verifique se o veículo já está no pátio.");
    } finally {
      setLoading(false);
    }
=======
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
>>>>>>> 0726f64c57c1433dbfe11c155c9ab4433a111e40
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={globalStyles.header}>
<<<<<<< HEAD
        <Text style={globalStyles.headerTitle}>Entrada de Veículo</Text>
=======
        <Text style={globalStyles.headerTitle}>Check-in</Text>
>>>>>>> 0726f64c57c1433dbfe11c155c9ab4433a111e40
      </View>

      <View style={globalStyles.container}>
        <View style={globalStyles.card}>
          <Text style={styles.label}>Placa do Veículo</Text>
<<<<<<< HEAD
          <TextInput 
            placeholder="ABC1234" 
            value={placa} 
            onChangeText={setPlaca} 
            autoCapitalize="characters" 
            style={globalStyles.input} 
          />
          
          <View style={styles.rowLabel}>
            <Text style={styles.label}>Código da Vaga</Text>
            {/* Atalho para o Scanner (Passo 2)[cite: 1] */}
            <TouchableOpacity onPress={() => navigation.navigate("Scanner")}>
              <Text style={styles.scannerLink}>Abrir Câmera (QR Code)</Text>
            </TouchableOpacity>
          </View>

          <TextInput 
            placeholder="Ex: A-01" 
            value={codigoVaga} 
            onChangeText={setCodigoVaga} 
            autoCapitalize="characters" 
            style={globalStyles.input} 
          />

          <TouchableOpacity 
            onPress={iniciar} 
            style={[globalStyles.button, loading && { opacity: 0.7 }]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={globalStyles.buttonText}>Confirmar Check-in</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Vagas Disponíveis Agora</Text>
=======
          <TextInput placeholder="ABC1234" value={placa} onChangeText={setPlaca} autoCapitalize="characters" style={globalStyles.input} />
          
          <Text style={styles.label}>Código da Vaga</Text>
          <TextInput placeholder="A-01" value={codigoVaga} onChangeText={setCodigoVaga} autoCapitalize="characters" style={globalStyles.input} />

          <TouchableOpacity onPress={iniciar} style={globalStyles.button}>
            <Text style={globalStyles.buttonText}>Confirmar Entrada</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Vagas Disponíveis</Text>
>>>>>>> 0726f64c57c1433dbfe11c155c9ab4433a111e40
        <FlatList
          data={vagasLivres}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => String(item.id)}
<<<<<<< HEAD
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma vaga livre no momento.</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.vagaBadge} 
              onPress={() => setCodigoVaga(item.codigo)}
            >
=======
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.vagaBadge} onPress={() => setCodigoVaga(item.codigo)}>
>>>>>>> 0726f64c57c1433dbfe11c155c9ab4433a111e40
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
<<<<<<< HEAD
  rowLabel: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scannerLink: { fontSize: 12, color: colors.primary, fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: colors.text, marginTop: spacing.lg, marginBottom: spacing.md },
  vagaBadge: { backgroundColor: colors.accent, paddingHorizontal: 20, paddingVertical: 12, borderRadius: radius.md, marginRight: 10, elevation: 2 },
  vagaBadgeText: { color: colors.textLight, fontWeight: "bold" },
  emptyText: { color: colors.muted, fontSize: 14, fontStyle: 'italic' }
});
=======
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: colors.text, marginTop: spacing.lg, marginBottom: spacing.md },
  vagaBadge: { backgroundColor: colors.accent, paddingHorizontal: 20, paddingVertical: 12, borderRadius: radius.md, marginRight: 10 },
  vagaBadgeText: { color: colors.textLight, fontWeight: "bold" }
});
>>>>>>> 0726f64c57c1433dbfe11c155c9ab4433a111e40
