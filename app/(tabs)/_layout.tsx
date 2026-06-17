import { getToken } from "@/src/storage/token";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";

export default function TabLayout() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true); //loading spiiner until the role is determined (prevents flickering between admin/user tabs)

    useEffect(() => {
        const checkUserRole = async () => { //read the token from the AsyncStorage
            try {
                const token = await getToken();
                if (token) {
                    const base64Url = token.split('.')[1]; //JWT has 3 parts separate by dot : header.payload.signature
                    // we take the middle part (index 1) which contains the userId and role
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    // JWT uses URL safe  Base64 encoding (- and _ instread of + and /)
                    // This converts it back to standard Base64 before decoding 
                    const jsonPayload = decodeURIComponent( //uses to handles special characters in the payload (convert percent-encoded character like '%20' back to spaces)
                        atob(base64).split('').map((c) => //atob built-in browser/JS function that decodes a Base64 string back to regular text
                            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                        ).join('')
                    );

                    // the decoded payload is a JSON string 
                    const decoded = JSON.parse(jsonPayload); //JSON.parse turns it into a JavaScript object like (userId: 'abc', role: 'ADMIN')
                    setIsAdmin(decoded.role === "ADMIN"); //if the role is admin then set isAdmin true 
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
                <ActivityIndicator size="large" /> {/*built-in react native spinning loading indicator shown while isLoadind is true*/}
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
                    // null completely hides the tab and makes its route inaccessible
                    // undefined shows it normally. So user-only tabs pass null for admins 
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
                    // the reverse for admin-only tabs - show for admins hide for users 
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="settings" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}