import { SafeAreaView } from "react-native-safe-area-context";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "../styles/theme";
import { globalStyles } from "../styles/globalStyles";
import api from "../services/api";

export default function Cadastro({ navigation }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmaSenha, setConfirmaSenha] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCadastro = async () => {
        if (!email || !senha || !confirmaSenha) {
            Alert.alert("Erro", "Preencha todos os campos obrigatórios");
            return;
        }

        if (senha !== confirmaSenha) {
            Alert.alert("Erro", "As senhas não coincidem");
            return;
        }

        setLoading(true);
        try {
            await api.post("/auth/register", { email, senha });

            Alert.alert("Sucesso", "Conta criada com sucesso!", [
                { text: "OK", onPress: () => navigation.replace("Login") }
            ]);
        } catch (error) {
            Alert.alert(
                "Erro",
                error.response?.data?.message || "Erro ao criar conta"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={22} color={colors.textLight} />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Criar conta</Text>
            </View>

            {/* CONTEÚDO */}
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.title}>Bem-vindo</Text>
                    <Text style={styles.subtitle}>
                        Crie sua conta para acessar o SmartPark
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="E-mail"
                        placeholderTextColor={colors.muted}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        placeholderTextColor={colors.muted}
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Confirmar senha"
                        placeholderTextColor={colors.muted}
                        value={confirmaSenha}
                        onChangeText={setConfirmaSenha}
                        secureTextEntry
                        autoCapitalize="none"
                    />

                    <TouchableOpacity
                        style={[
                            styles.button,
                            loading && styles.buttonDisabled
                        ]}
                        onPress={handleCadastro}
                        disabled={loading}
                    >
                        <Text style={globalStyles.buttonText}>
                            {loading ? "Criando conta..." : "Criar conta"}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Já tem conta?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <Text style={styles.link}>Entrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.secondary,
    },

    /* HEADER */
    header: {
        height: 140,
        backgroundColor: colors.secondary,
        paddingHorizontal: spacing.md,
        paddingTop: spacing.lg,
        justifyContent: "flex-end",
    },
    backButton: {
        position: "absolute",
        top: spacing.lg,
        left: spacing.md,
        backgroundColor: "rgba(255,255,255,0.15)",
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: colors.textLight,
        marginBottom: spacing.md,
    },

    /* CONTENT */
    content: {
        flexGrow: 1,
        backgroundColor: colors.background,
        borderTopLeftRadius: radius.lg,
        borderTopRightRadius: radius.lg,
        padding: spacing.lg,
        marginTop: -radius.lg,
    },

    card: {
        backgroundColor: colors.card,
        borderRadius: radius.lg,
        padding: spacing.lg,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
    },

    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: colors.text,
        marginBottom: spacing.xs,
    },
    subtitle: {
        fontSize: 14,
        color: colors.muted,
        marginBottom: spacing.lg,
    },

    input: {
        backgroundColor: colors.background,
        borderRadius: radius.md,
        padding: spacing.md,
        fontSize: 16,
        color: colors.text,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.md,
    },

    button: {
        backgroundColor: colors.primary,
        height: 54,
        borderRadius: radius.md,
        justifyContent: "center",
        alignItems: "center",
        marginTop: spacing.md,
    },
    buttonDisabled: {
        opacity: 0.6,
    },

    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: spacing.lg,
    },
    footerText: {
        color: colors.muted,
        marginRight: spacing.xs,
    },
    link: {
        color: colors.primary,
        fontWeight: "bold",
    },
});
