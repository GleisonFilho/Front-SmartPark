import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, SafeAreaView } from "react-native";
import { colors, spacing, radius } from "../styles/theme";
import { globalStyles } from "../styles/globalStyles";
import api from "../services/api";
import { Ionicons } from "@expo/vector-icons";

export default function AdminDashboard({ navigation }) {
    const [estacionamentos, setEstacionamentos] = useState([]);
    const [stats, setStats] = useState({ totalEstacionamentos: 0, totalVagas: 0 });

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const response = await api.get('/estacionamentos');
            setEstacionamentos(response.data);
            
            const totalVagas = response.data.reduce((acc, curr) => acc + curr.vagasTotais, 0);
            setStats({
                totalEstacionamentos: response.data.length,
                totalVagas: totalVagas
            });
        } catch (error) {
            console.error("Erro ao carregar dados do admin", error);
        }
    };

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <View style={globalStyles.header}>
                <Text style={globalStyles.headerTitle}>Painel Admin</Text>
                <Text style={{color: colors.muted}}>Visão Geral da Rede</Text>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Ionicons name="business" size={24} color={colors.primary} />
                        <Text style={styles.statValue}>{stats.totalEstacionamentos}</Text>
                        <Text style={styles.statLabel}>Unidades</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="car" size={24} color={colors.accent} />
                        <Text style={styles.statValue}>{stats.totalVagas}</Text>
                        <Text style={styles.statLabel}>Vagas Totais</Text>
                    </View>
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Estacionamentos Cadastrados</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('AdminCadastroEstacionamento')}>
                        <Ionicons name="add-circle" size={30} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                {estacionamentos.map((item) => (
                    <View key={item.id} style={globalStyles.card}>
                        <View style={styles.estHeader}>
                            <Text style={styles.estNome}>{item.nome}</Text>
                            <Text style={styles.estPreco}>R$ {item.valorHora.toFixed(2)}/h</Text>
                        </View>
                        <Text style={styles.estEnd}>{item.endereco}</Text>
                        <View style={styles.estFooter}>
                            <Text style={styles.estVagas}>{item.vagasTotais} vagas</Text>
                            <TouchableOpacity style={styles.btnEdit}>
                                <Text style={styles.btnEditText}>Gerenciar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: spacing.lg,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xl,
    },
    statCard: {
        backgroundColor: colors.card,
        width: '48%',
        padding: spacing.lg,
        borderRadius: radius.lg,
        alignItems: 'center',
        elevation: 3,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.secondary,
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: colors.muted,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.secondary,
    },
    estHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    estNome: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.secondary,
    },
    estPreco: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    estEnd: {
        fontSize: 12,
        color: colors.muted,
        marginTop: 4,
    },
    estFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.md,
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    estVagas: {
        fontSize: 14,
        color: colors.text,
    },
    btnEdit: {
        backgroundColor: colors.secondary,
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: radius.sm,
    },
    btnEditText: {
        color: '#fff',
        fontSize: 12,
    }
});
