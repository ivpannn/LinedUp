import { getToken } from "@/src/storage/token";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";

export default function TabLayout() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkUserRole = async () => {
            try {
                const token = await getToken();
                if (token) {
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(
                        atob(base64).split('').map((c) =>
                            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                        ).join('')
                    );
                    const decoded = JSON.parse(jsonPayload);
                    setIsAdmin(decoded.role === "ADMIN");
                }
            } catch (error) {
                console.log("Error checking user role:", error);
            } finally {
                setIsLoading(false);
            }
        };
        checkUserRole();
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#000",
                tabBarInactiveTintColor: "#999",
            }}
        >
            {/* Order matters — this is the rendered tab order */}
            <Tabs.Screen
                name="main"
                options={{
                    title: "Home",
                    href: isAdmin ? null : undefined,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="restaurant" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="queuing"
                options={{
                    title: "Queue",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="list" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="adminScreen"
                options={{
                    title: "Dashboard",
                    href: isAdmin ? undefined : null,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="settings" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}