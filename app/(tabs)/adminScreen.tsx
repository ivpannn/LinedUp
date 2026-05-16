import { API } from '@/src/services/api';
import { getToken } from '@/src/storage/token';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

const AdminScreen = () => {

    const [queues, setQueues] = useState<any[]>([]);
    const [completedQueues, setCompletedQueues] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchQueues = async () => {
        try {
            const token = await getToken();
            if (!token) {
                router.push("/(auth)/login");
                return;
            }

            const response = await API.get("/admin/queues", {
                headers: {
                    Authorization: token,
                },
            });

            const allQueues = response.data;
            setQueues(allQueues.filter((q: any) => q.status !== "COMPLETED"));
            setCompletedQueues(allQueues.filter((q: any) => q.status === "COMPLETED"));
        } catch (error: any) {
            console.log("Error fetching queues:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const callNextQueue = async () => {
        try {
            const token = await getToken();
            if (!token) return;

            await API.post("/admin/call-next", {}, {
                headers: {
                    Authorization: token,
                },
            });

            fetchQueues();
            alert("Next queue called");
        } catch (error: any) {
            alert(error.response?.data?.message || "Failed to call next queue");
        }
    };

    const completeQueue = async (id: string) => {
        try {
            const token = await getToken();
            if (!token) return;

            await API.patch(`/admin/${id}/complete`, {}, {
                headers: {
                    Authorization: token,
                },
            });

            fetchQueues();
            alert("Queue marked as completed");
        } catch (error: any) {
            alert(error.response?.data?.message || "Failed to complete queue");
        }
    };

    useEffect(() => {
        const checkAdminAuth = async () => {
            const token = await getToken();
            if (!token) {
                router.push("/(auth)/login");
            } else {
                fetchQueues();
            }
        };
        checkAdminAuth();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin Dashboard</Text>

            <Pressable
                style={styles.nextButton}
                onPress={callNextQueue}
            >
                <Text style={styles.buttonText}>Call Next Queue</Text>
            </Pressable>

            <Text style={styles.sectionTitle}>Active Queues</Text>

            <FlatList
                data={queues}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View>
                            <Text style={styles.queueNumberText}>Queue #{item.queueNumber}</Text>
                            <Text style={styles.restaurantName}>
                                {item.restaurant?.name ?? "Unknown Restaurant"}
                            </Text>
                            <Text style={[
                                styles.statusText,
                                item.status === "SERVING" ? styles.servingStatus : styles.waitingStatus
                            ]}>
                                {item.status}
                            </Text>
                            <Text style={styles.userName}>{item.user?.name || "Unknown"}</Text>
                        </View>
                        {item.status === "SERVING" && (
                            <Pressable style={styles.completeButton} onPress={() => completeQueue(item.id)}>
                                <Text style={styles.buttonText}>Complete</Text>
                            </Pressable>
                        )}
                    </View>
                )}
            />

            {completedQueues.length > 0 && (
                <>
                    <Text style={styles.sectionTitle}>Completed</Text>
                    <FlatList
                        data={completedQueues}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={[styles.card, styles.completedCard]}>
                                <View>
                                    <Text style={styles.queueNumberText}>#{item.queueNumber}</Text>
                                    <Text style={styles.restaurantName}>
                                        {item.restaurant?.name ?? "Unknown Restaurant"}
                                    </Text>
                                    <Text style={styles.completedStatusText}>COMPLETED</Text>
                                    <Text style={styles.userName}>{item.user?.name || "Unknown"}</Text>
                                </View>
                            </View>
                        )}
                    />
                </>
            )}
        </View>
    );
}

export default AdminScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
    },

    title: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 20,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
    },

    nextButton: {
        backgroundColor: "black",
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },

    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 14,
    },

    card: {
        backgroundColor: "#f2f2f2",
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    completedCard: {
        backgroundColor: "#e8f5e9",
        borderWidth: 1,
        borderColor: "#ddd",
    },

    queueNumberText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },

    restaurantName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        marginBottom: 3,
    },

    statusText: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 5,
    },

    waitingStatus: {
        color: "#ff9800",
    },

    servingStatus: {
        color: "#2196f3",
    },

    completedStatusText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#4caf50",
        marginBottom: 5,
    },

    userName: {
        fontSize: 12,
        color: "#666",
    },

    completeButton: {
        backgroundColor: "green",
        padding: 10,
        borderRadius: 8,
    },
});