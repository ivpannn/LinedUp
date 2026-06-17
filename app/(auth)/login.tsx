import { saveToken } from "@/src/storage/token";
import { router } from 'expo-router';
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { API } from "../../src/services/api";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await API.post("auth/login", { //sends POST request to /auth/login with email and password 
                email: email.toLowerCase().trim(),
                password: password.trim(),
            });
            console.log('qwe')

            //login will create a token
            await saveToken(response.data.token); //server sends back JWT token
            // saveToken() calls AsynceStorage.setItem('token', ...) to save it on the device permanently 

            // Navigate to appropriate screen based on role
            if (response.data.user?.role === "ADMIN") { //? = if null, return undefined instead of crashing 
                router.replace("/(tabs)/queuing");
            } else {
                router.replace("/(tabs)/main");
            }
        } catch (error: any) { //error catch block run instead
            console.log(
                "LoGIN ERROR: ", error.response?.data || error.message
            );
            alert(
                error.response?.data.message || "Login unsuccessful"
            );
        } //every futher API call reads the token and sends it in headers
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>LinedUp</Text>

            <TextInput
                placeholder="Email"
                style={styles.input}
                value={email} // display the current state
                onChangeText={setEmail} // calls setEmail every keystroke, updating the state 
                placeholderTextColor='#555'
                keyboardType="email-address"
            />

            <TextInput
                placeholder="Password"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholderTextColor='#555'
                secureTextEntry
            />

            <Pressable
                style={styles.button}
                onPress={handleLogin}
            >
                {/* <Text className=" text-white text-xl text-center">Login</Text> */}
                <Text style={styles.textBtn}>Login</Text>
            </Pressable>

            <View style={styles.register}>
                <View style={styles.row}>
                    <Text>Don't have an account?</Text>
                    <Pressable
                        onPress={() => router.push('/(auth)/register')}
                    >
                        <Text style={styles.registerTxt}> Register Now!</Text>
                    </Pressable>
                </View>
            </View>
        </View >
    )
}

export default Login;

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

    register: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },

    row: {
        flexDirection: 'row',
    },

    registerTxt: {
        color: 'blue',
        textDecorationLine: 'underline'
    },
})