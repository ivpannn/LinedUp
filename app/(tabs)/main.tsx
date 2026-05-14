import { removeToken } from "@/src/storage/token";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

// import Restaurants from "@/components/restaurant"; // TODO: Define your restaurant type

// TODO: Replace with your restaurant data structure
interface Restaurant {
    id: string;
    name: string;
    location: string;
    cuisineType: string;
    estimatedWait: number; // in minutes
}

const Main = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);

    // TODO: Replace with your API call to fetch restaurants
    useEffect(() => {
        const loadRestaurants = async () => {
            try {
                setLoading(true);
                // Add your restaurant fetching logic here
                // const response = await API.get("/restaurants");
                // setRestaurants(response.data);

                // Placeholder data - replace with real data
                setRestaurants([]);
            } catch (error) {
                console.log("Error loading restaurants:", error);
            } finally {
                setLoading(false);
            }
        };

        loadRestaurants();
    }, []);

    const handleQueuePress = (restaurantId: string) => {
        // TODO: Store selected restaurant ID and navigate to queuing page
        router.push("/(tabs)/queuing");
    };

    const logout = async () => {
        await removeToken();
        router.push("/(auth)/login");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Restaurants</Text>

            {loading ? (
                <Text style={styles.loadingText}>Loading restaurants...</Text>
            ) : restaurants.length === 0 ? (
                <Text style={styles.emptyText}>No restaurants available. Add your restaurant data.</Text>
            ) : (
                <FlatList
                    data={restaurants}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.restaurantCard}>
                            <Text style={styles.restaurantName}>{item.name}</Text>
                            <Text style={styles.restaurantInfo}>{item.location}</Text>
                            <Text style={styles.restaurantInfo}>{item.cuisineType}</Text>
                            <Text style={styles.waitTime}>Est. Wait: {item.estimatedWait} min</Text>

                            <Pressable
                                style={styles.queueButton}
                                onPress={() => handleQueuePress(item.id)}
                            >
                                <Text style={styles.buttonText}>Join Queue</Text>
                            </Pressable>
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

    restaurantCard: {
        backgroundColor: "#f9f9f9",
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#eee",
    },

    restaurantName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },

    restaurantInfo: {
        fontSize: 14,
        color: "#666",
        marginBottom: 5,
    },

    waitTime: {
        fontSize: 14,
        fontWeight: "500",
        color: "#e30808",
        marginBottom: 10,
    },

    queueButton: {
        backgroundColor: "green",
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
    },

    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
    },

    logoutButton: {
        backgroundColor: "#333",
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
});
