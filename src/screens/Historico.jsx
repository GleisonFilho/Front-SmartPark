import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { api } from "../services/api";

export default function Historico() {
  const [finalizadas, setFinalizadas] = useState([]);

  async function carregar() {
    try {
      const res = await api.get("/estadias/finalizadas");
      setFinalizadas(res.data?.content ?? res.data ?? []);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar histórico");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#0b1b33" }}>
      <Text style={{ color: "#fff", fontSize: 22, marginBottom: 15 }}>
        Histórico de estadias
      </Text>

      <FlatList
        data={finalizadas}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => {
          const entrada = item?.entrada
            ? new Date(item.entrada).toLocaleString()
            : "—";

          const saida = item?.saida
            ? new Date(item.saida).toLocaleString()
            : "—";

          return (
            <View
              style={{
                backgroundColor: "#fff",
                padding: 12,
                borderRadius: 10,
                marginBottom: 8,
              }}
            >
              <Text>Placa: {item?.veiculo?.placa ?? "—"}</Text>
              <Text>Vaga: {item?.vaga?.codigo ?? "—"}</Text>
              <Text>Entrada: {entrada}</Text>
              <Text>Saída: {saida}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}
