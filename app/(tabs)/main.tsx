import RestaurantCard from "@/components/restaurantCard";
import { API } from "@/src/services/api";
import { setSelectedRestaurant } from "@/src/storage/selectedRestaurant";
import { getToken, removeToken } from "@/src/storage/token";
import { calculateWaitTime } from "@/src/utils/waitTimeCalculator";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

interface Restaurant {
    id: string;
    image: string;
    name: string;
    location: string;
    cuisineType: string;
    estimatedWait: number;
}

const restaurant = [
    { id: 'rest_1', image: require("../../assets/images/hdl-pav-bj.jpg"), name: 'Hai Di Lao', location: 'Pavilion Bukit Jalil', cuisineType: 'Hotpot' },
    { id: 'rest_2', image: require("../../assets/images/shin-zushi.webp"), name: 'Shin zushi', location: 'Jalan Jalil Jaya 7', cuisineType: 'Sushi' },
    { id: 'rest_3', image: require("../../assets/images/oriental-kopi.webp"), name: 'Oriental Kopi', location: 'Mid Valley', cuisineType: 'Cafe' },
    { id: 'rest_4', image: require("../../assets/images/village-park.jpg"), name: 'Village Park', location: 'Petaling Jaya', cuisineType: 'Nasi Lemak' },
    { id: "rest_5", image: require("../../assets/images/taisyu-yakiniku.webp"), name: "Taisyu Yakiniku", location: "Taman Desa", cuisineType: "Japansese" },
    { id: "rest_6", image: require("../../assets/images/gepuklah.jpg"), name: "Gepuklah", location: "Jalan SS 23/11, Taman Sea", cuisineType: "Nasi Lemak" },
];

const Main = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkUserAndLoadRestaurants = async () => {
            try {
                setLoading(true);

                // Check if user is admin
                const token = await getToken();
                if (token) {
                    try {
                        const base64Url = token.split('.')[1];
                        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                        const jsonPayload = decodeURIComponent(
                            atob(base64).split('').map((c) => {
                                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                            }).join('')
                        );

                        const decoded = JSON.parse(jsonPayload);
                        if (decoded.role === "ADMIN") {
                            setIsAdmin(true);
                        }
                    } catch (error) {
                        console.log("Error decoding token:", error);
                    }

                    // Fetch the full queue list (all restaurants)
                    try {
                        const response = await API.get("/queue", {
                            headers: { Authorization: token },
                        });
                        const queueList = response.data.queue || [];

                        console.log("Queue List:", queueList); // Log the queue list to see its structure and contents

                        // Fetch each restaurant, count how many active entries exist
                        const merged: Restaurant[] = restaurant.map((r) => {
                            const activeCount = queueList.filter((q: any) => q.restaurantId === r.id).length;

                            return { ...r, estimatedWait: calculateWaitTime(activeCount + 1), };
                        }); 

                        setRestaurants(merged);
                    } catch (error) {
                        console.log("Error fetching queue list:", error);
                        setRestaurants(restaurants.map(r => ({ ...r, estimatedWait: 0 }))
                        );
                    }
                }
            } catch (error) {
                console.log("Error loading restaurants:", error);
                setRestaurants(restaurants.map(r => ({ ...r, estimatedWait: 0 })));
            } finally {
                setLoading(false); //hides the loading text, runs in the finally block so it always runs even if there is an error
            }
        };

        checkUserAndLoadRestaurants();
    }, []);

    const handleQueuePress = async (restaurantId: string, restaurantName: string) => {
        // Only regular users can join queue
        if (isAdmin) {
            alert("Admins cannot join queue");
            return;
        }

        // Store selected restaurant in AsyncStorage and navigate
        await setSelectedRestaurant({ id: restaurantId, name: restaurantName });
        router.push("/(tabs)/queuing"); //.push() = added to history (user can go back), .replace() = removes history 
    };


    const logout = async () => {
        await removeToken();
        router.replace("/(auth)/login");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>LinedUp</Text>

            {loading ? (
                <Text style={styles.loadingText}>Loading restaurants...</Text>
            ) : restaurants.length === 0 ? (
                <Text style={styles.emptyText}>No restaurants available</Text>
            ) : (
                <FlatList
                    data={restaurants}
                    keyExtractor={(item) => item.id} //gives each item a unique key - react uses this to track which items changed and only re-render those 
                    renderItem={({ item }) => ( //each item in data, render this JSX
                        <View style={styles.cardContainer}>
                            <RestaurantCard
                                restaurant={item}
                                onPress={() => handleQueuePress(item.id, item.name)}
                                isAdmin={isAdmin}
                            />
                        </View>
                    )}
                />
            )}

            <Pressable style={styles.logoutButton} onPress={logout}>
                <Text style={styles.buttonText}>Logout</Text>
            </Pressable>
        </View>
    );
};

export default Main;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
        backgroundColor: "#fff",
    },

    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 20,
    },

    loadingText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginTop: 20,
    },

    emptyText: {
        fontSize: 16,
        color: "#999",
        textAlign: "center",
        marginTop: 20,
    },

    cardContainer: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderRadius: 10,
        borderColor: "#ddd",
        padding: 10,
        paddingBottom: 15,
    },

    logoutButton: {
        backgroundColor: "#333",
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },

    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
    },
});