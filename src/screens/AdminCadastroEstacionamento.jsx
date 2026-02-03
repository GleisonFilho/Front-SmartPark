import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '../styles/theme';
import { globalStyles } from '../styles/globalStyles';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function AdminCadastroEstacionamento({ navigation }) {
    const [form, setForm] = useState({
        nome: '',
        endereco: '',
        latitude: '',
        longitude: '',
        vagasTotais: '',
        valorHora: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSalvar = async () => {
        if (!form.nome || !form.endereco || !form.latitude || !form.longitude || !form.vagasTotais || !form.valorHora) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }

        setLoading(true);
        try {
            await api.post('/estacionamentos', {
                ...form,
                latitude: parseFloat(form.latitude),
                longitude: parseFloat(form.longitude),
                vagasTotais: parseInt(form.vagasTotais),
                valorHora: parseFloat(form.valorHora)
            });
            Alert.alert("Sucesso", "Estacionamento cadastrado com sucesso!");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Erro", "Falha ao cadastrar estacionamento");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <View style={globalStyles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{marginRight: spacing.md}}>
                    <Ionicons name="arrow-back" size={24} color={colors.textLight} />
                </TouchableOpacity>
                <Text style={globalStyles.headerTitle}>Novo Estacionamento</Text>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={globalStyles.card}>
                    <Text style={styles.label}>Nome do Estacionamento</Text>
                    <TextInput
                        style={styles.input}
                        value={form.nome}
                        onChangeText={(t) => setForm({...form, nome: t})}
                        placeholder="Ex: Estacionamento Central"
                    />

                    <Text style={styles.label}>Endereço</Text>
                    <TextInput
                        style={styles.input}
                        value={form.endereco}
                        onChangeText={(t) => setForm({...form, endereco: t})}
                        placeholder="Rua, Número, Bairro"
                    />

                    <View style={styles.row}>
                        <View style={{flex: 1, marginRight: spacing.sm}}>
                            <Text style={styles.label}>Latitude</Text>
                            <TextInput
                                style={styles.input}
                                value={form.latitude}
                                onChangeText={(t) => setForm({...form, latitude: t})}
                                keyboardType="numeric"
                                placeholder="-23.5505"
                            />
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={styles.label}>Longitude</Text>
                            <TextInput
                                style={styles.input}
                                value={form.longitude}
                                onChangeText={(t) => setForm({...form, longitude: t})}
                                keyboardType="numeric"
                                placeholder="-46.6333"
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={{flex: 1, marginRight: spacing.sm}}>
                            <Text style={styles.label}>Vagas Totais</Text>
                            <TextInput
                                style={styles.input}
                                value={form.vagasTotais}
                                onChangeText={(t) => setForm({...form, vagasTotais: t})}
                                keyboardType="numeric"
                                placeholder="50"
                            />
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={styles.label}>Valor/Hora (R$)</Text>
                            <TextInput
                                style={styles.input}
                                value={form.valorHora}
                                onChangeText={(t) => setForm({...form, valorHora: t})}
                                keyboardType="numeric"
                                placeholder="10.00"
                            />
                        </View>
                    </View>

                    <TouchableOpacity 
                        style={[styles.button, loading && {opacity: 0.7}]} 
                        onPress={handleSalvar}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: spacing.lg,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.secondary,
        marginBottom: 4,
        marginTop: spacing.md,
    },
    input: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        padding: spacing.md,
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
    },
    button: {
        backgroundColor: colors.primary,
        padding: spacing.lg,
        borderRadius: radius.md,
        alignItems: 'center',
        marginTop: spacing.xl,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
