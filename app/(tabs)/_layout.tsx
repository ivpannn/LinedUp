import { getToken } from "@/src/storage/token";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabNavigationOptions, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";

import AdminScreen from "./adminScreen";
import Main from "./main";
import Map from "./map";
import Rating from "./ratings";
import Queuing from "./queuing";
import Profile from "./profile";

const Tab = createBottomTabNavigator();

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
                    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));

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
        return null;
    }

    const tabScreenOptions: BottomTabNavigationOptions = {
        headerShown: false,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#999",
    };

    return (
        <Tab.Navigator screenOptions={tabScreenOptions}>
            {isAdmin ? (
                // Admin navigation
                <>
                    <Tab.Screen
                        name="queuing"
                        component={Queuing}
                        options={{
                            title: "Queue",
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="list" size={size} color={color} />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="adminScreen"
                        component={AdminScreen}
                        options={{
                            title: "Dashboard",
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="settings" size={size} color={color} />
                            ),
                        }}
                    />
                </>
            ) : (
                // User navigation
                <>
                    <Tab.Screen
                        name="main"
                        component={Main}
                        options={{
                            title: "Home",
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="restaurant" size={size} color={color} />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="map"
                        component={Map}
                        options={{
                            title: "Map",
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="map" size={size} color={color} />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="rating"
                        component={Rating}
                        options={{
                            title: "Ratings",
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="star" size={size} color={color} />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="profile"
                        component={Profile}
                        options={{
                            title: "Profile",
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="person" size={size} color={color} />
                            ),
                        }}
                    />
                </>
            )}
        </Tab.Navigator>
    );
}
