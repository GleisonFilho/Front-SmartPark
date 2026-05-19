import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { useState } from "react";
import { colors, spacing, radius } from "../styles/theme";
<<<<<<< HEAD

// Importamos o hook de autenticação
import { useAuth } from "../context/AuthContext";
=======
import api from "../services/api";
>>>>>>> 0726f64c57c1433dbfe11c155c9ab4433a111e40

export default function Login({ navigation }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
<<<<<<< HEAD
    
    // Pegamos a função signIn e o estado de loading do contexto
    const { signIn, loading } = useAuth();
=======
    const [loading, setLoading] = useState(false);
>>>>>>> 0726f64c57c1433dbfe11c155c9ab4433a111e40

    const handleLogin = async () => {
        if (!email || !senha) {
            Alert.alert("Erro", "Informe email e senha");
            return;
        }

<<<<<<< HEAD
        // Chamamos o login do contexto
        // Note que não precisamos mais de navigation.navigate aqui!
        await signIn(email, senha);
=======
        setLoading(true);
        try {
            const response = await api.post("/auth/login", {
                email,
                senha
            });

            const { role } = response.data;
            navigation.replace("Main", { role });

        } catch (error) {
            Alert.alert(
                "Erro",
                error.response?.data?.message || "Email ou senha inválidos"
            );
        } finally {
            setLoading(false);
        }
>>>>>>> 0726f64c57c1433dbfe11c155c9ab4433a111e40
    };

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                
                <View style={styles.logoConteiner}>
                    <Image source={require('../../assets/LOGO.png')} style={styles.imgLogo} />
                    <Text style={styles.logoTitle}>SmartPark</Text>
                    <Text style={styles.logoSubtitle}>Seu estacionamento inteligente</Text>
                </View>

                <View style={styles.inputConteiner}>
                    <Text style={styles.loginTitle}>Bem-vindo de volta!</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="E-mail"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry
                        autoCapitalize="none"
                    />

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading
                            ? <ActivityIndicator color="#fff" />
                            : <Text style={globalStyles.buttonText}>Entrar</Text>
                        }
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
                        <Text style={styles.linkText}>Criar uma conta</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
<<<<<<< HEAD

// Os estilos (styles) permanecem exatamente os mesmos que você já tem.
const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1 },
=======
const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
>>>>>>> 0726f64c57c1433dbfe11c155c9ab4433a111e40
    logoConteiner: {
        flex: 0.35,
        justifyContent: "flex-end",
        alignItems: 'center',
        backgroundColor: colors.secondary,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xl,
    },
<<<<<<< HEAD
    imgLogo: { width: 100, height: 100, borderRadius: 20, marginBottom: spacing.md },
    logoTitle: { fontSize: 28, fontWeight: 'bold', color: colors.textLight },
    logoSubtitle: { fontSize: 13, color: "rgba(255, 255, 255, 0.7)", marginTop: spacing.xs },
=======
    imgLogo: {
        width: 100,
        height: 100,
        borderRadius: 20,
        marginBottom: spacing.md,
    },
    logoTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.textLight,
    },
    logoSubtitle: {
        fontSize: 13,
        color: "rgba(255, 255, 255, 0.7)",
        marginTop: spacing.xs,
    },
>>>>>>> 0726f64c57c1433dbfe11c155c9ab4433a111e40
    inputConteiner: {
        flex: 0.65,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        backgroundColor: colors.background,
    },
<<<<<<< HEAD
    loginTitle: { fontSize: 26, fontWeight: 'bold', color: colors.secondary, marginBottom: spacing.sm },
=======
    loginTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: colors.secondary,
        marginBottom: spacing.sm,
    },
>>>>>>> 0726f64c57c1433dbfe11c155c9ab4433a111e40
    input: {
        backgroundColor: colors.card,
        borderRadius: radius.md,
        padding: spacing.md,
        fontSize: 16,
        color: colors.text,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.md,
    },
    loginButton: {
        backgroundColor: colors.primary,
        height: 54,
        borderRadius: radius.md,
        justifyContent: "center",
        alignItems: 'center',
        marginTop: spacing.md,
    },
    linkText: {
        textAlign: 'center',
        fontSize: 16,
        marginTop: spacing.lg,
        color: colors.primary,
        fontWeight: 'bold',
    },
<<<<<<< HEAD
});
=======
});

>>>>>>> 0726f64c57c1433dbfe11c155c9ab4433a111e40
