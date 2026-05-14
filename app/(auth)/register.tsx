import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";

import { API } from "@/src/services/api"
import { router } from "expo-router";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try {
            await API.post("/auth/register", {
                name,
                email,
                password,
            });

            router.replace("/(auth)/login");
        } catch (error) {
            alert("Register unsuccessful")
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            <TextInput
                placeholder="Name"
                style={styles.input}
                value={name}
                onChangeText={setName}
            />

            <TextInput
                placeholder="Email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />

            <TextInput
                placeholder="Password"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Pressable
                style={styles.button}
                onPress={handleRegister}
            >
                <Text style={styles.textBtn}>Register</Text>
            </Pressable>
        </View>
    )

}

export default Register;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        // maxWidth: '100%',
    },

    title: {
        fontSize: 32,
        fontWeight: 'bold',
        justifyContent: 'center',
        textAlign: 'center',
        margin: 10,
    },

    input: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#ccc',
        padding: 15,
        marginBottom: 15,
    },

    button: {
        margin: 5,
        padding: 15,
        backgroundColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        width: '50%',
        alignSelf: 'center',
    },

    textBtn: {
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
    },
})