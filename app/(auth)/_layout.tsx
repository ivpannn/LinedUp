import { Stack } from "expo-router";

export default function AuthLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="login" // register login.tsx as a screen named 'login' inside this auth stack
                options={{
                    headerShown: false,
                    animation: "none", //disable the slide-in animation for the login screen - it appears instantly as this is the first screen after redirect
                }}
            />
            <Stack.Screen
                name="register"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}
