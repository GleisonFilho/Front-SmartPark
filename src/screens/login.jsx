import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { useState } from "react";
import { colors, spacing, radius } from "../styles/theme";

// Importamos o hook de autenticação
import { useAuth } from "../context/AuthContext";

export default function Login({ navigation }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    
    // Pegamos a função signIn e o estado de loading do contexto
    const { signIn, loading } = useAuth();

    const handleLogin = async () => {
        if (!email || !senha) {
            Alert.alert("Erro", "Informe email e senha");
            return;
        }

        // Chamamos o login do contexto
        // Note que não precisamos mais de navigation.navigate aqui!
        await signIn(email, senha);
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

// Os estilos (styles) permanecem exatamente os mesmos que você já tem.
const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1 },
    logoConteiner: {
        flex: 0.35,
        justifyContent: "flex-end",
        alignItems: 'center',
        backgroundColor: colors.secondary,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xl,
    },
    imgLogo: { width: 100, height: 100, borderRadius: 20, marginBottom: spacing.md },
    logoTitle: { fontSize: 28, fontWeight: 'bold', color: colors.textLight },
    logoSubtitle: { fontSize: 13, color: "rgba(255, 255, 255, 0.7)", marginTop: spacing.xs },
    inputConteiner: {
        flex: 0.65,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        backgroundColor: colors.background,
    },
    loginTitle: { fontSize: 26, fontWeight: 'bold', color: colors.secondary, marginBottom: spacing.sm },
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
});