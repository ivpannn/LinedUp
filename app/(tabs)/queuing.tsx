import { API } from "@/src/services/api";
import { clearSelectedRestaurant, getSelectedRestaurant } from "@/src/storage/selectedRestaurant";
import { getToken, removeToken } from "@/src/storage/token";
import { calculateWaitTime, getQueuePosition } from "@/src/utils/waitTimeCalculator";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";

const Queuing = () => {
    const [queues, setQueues] = useState<any[]>([]);
    const [myQueue, setMyQueue] = useState<any>(null);
    const [waitTime, setWaitTime] = useState(0);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
    const [alertShown, setAlertShown] = useState(false);

    // Fetch all queues
    const fetchQueues = async (userId: string | null) => {
        try {
            const token = await getToken();
            if (!token) return;

            // Get current restaurant from storage directly (don't rely on state here)
            const restaurant = await getSelectedRestaurant();
            const restaurantId = restaurant?.id;

            const response = await API.get("/queue", {
                headers: { Authorization: token },
                params: restaurantId ? { restaurantId } : {},
            });

            const queueList = response.data.queue || [];
            setQueues(queueList);

            if (userId) {
                const userQueue = queueList.find((q: any) =>
                    q.userId === userId &&
                    (q.status === "WAITING" || q.status === "SERVING")
                );

                if (userQueue) {
                    setMyQueue(userQueue);
                    const position = getQueuePosition(queueList, userId);
                    const newWaitTime = calculateWaitTime(position);
                    setWaitTime(newWaitTime);

                    if (newWaitTime === 5 && !alertShown) {
                        Alert.alert("Almost your turn!", "Your queue is estimated in 5 minutes");
                        setAlertShown(true);
                    }
                } else {
                    // user not in queue (left or completed)
                    setMyQueue(null);
                    setWaitTime(0);
                }
            }
        } catch (error: any) {
            console.log("Error fetching queues:", error.response?.data || error.message);
        }
    };

    const joinQueue = async () => {
        if (isAdmin) {
            alert("Admins cannot join queue");
            return;
        }

        if (!selectedRestaurant?.id) {
            alert("Please select a restaurant from the Home screen first");
            return;
        }

        try {
            const token = await getToken();
            if (!token) { alert("Please login first"); return; }

            await API.post(
                "/queue/join",
                { restaurantId: selectedRestaurant.id },  // ← real DB id
                { headers: { Authorization: token } }
            );

            await fetchQueues(currentUserId);
            alert("Joined queue");
        } catch (error: any) {
            alert(error.response?.data?.message || "Join queue failed");
        }
    };

    const leaveQueue = async () => {
        try {
            const token = await getToken();
            await API.post("/queue/leave", {}, {
                headers: { Authorization: token },
            });

            setMyQueue(null);
            setWaitTime(0);
            setAlertShown(false);
            await fetchQueues(currentUserId);
            alert("Queue cancelled");
        } catch (error: any) {
            alert(error.response?.data?.message || "Failed to cancel queue");
        }
    };

    const logout = async () => {
        await removeToken();
        await clearSelectedRestaurant();
        router.replace("/(auth)/login");
    };

    // Decode JWT once on mount
    useEffect(() => {
        const initializeUser = async () => {
            try {
                const token = await getToken();
                if (!token) { router.replace("/(auth)/login"); return; }

                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                    atob(base64).split('').map((c) =>
                        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                    ).join('')
                );
                const decoded = JSON.parse(jsonPayload);
                const userId = decoded.userId;

                setCurrentUserId(userId);
                setIsAdmin(decoded.role === "ADMIN");

                await fetchQueues(userId);
            } catch (error) {
                console.log("Error initializing user:", error);
                router.replace("/(auth)/login");
            }
        };
        initializeUser();
    }, []);

    // Re-read selected restaurant every time this screen is focused
    // This fixes the race condition where storage is written just before navigation
    useFocusEffect(
        useCallback(() => {
            const loadRestaurant = async () => {
                const restaurant = await getSelectedRestaurant();
                setSelectedRestaurant(restaurant);

                await fetchQueues(currentUserId);
            };
            loadRestaurant();
        }, [currentUserId])
    );

    // Poll every 60s
    useEffect(() => {
        if (!currentUserId) return;

        const interval = setInterval(() => {
            fetchQueues(currentUserId);
        }, 60000);

        return () => clearInterval(interval);
    }, [currentUserId, alertShown]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {selectedRestaurant?.name ? `Queue - ${selectedRestaurant.name}` : "Select a Restaurant"}
            </Text>

            {myQueue && (
                <View style={styles.myQueueCard}>
                    <Text style={styles.queueText}>Your Queue Number</Text>
                    <Text style={styles.queueNumber}>#{myQueue.queueNumber}</Text>
                    <Text style={styles.waitTimeText}>Estimated wait: {waitTime} minutes</Text>
                </View>
            )}

            {!myQueue && !isAdmin && (
                <Pressable style={styles.joinButton} onPress={joinQueue}>
                    <Text style={styles.buttonText}>Join Queue</Text>
                </Pressable>
            )}

            {myQueue && (
                <Pressable style={styles.cancelButton} onPress={leaveQueue}>
                    <Text style={styles.buttonText}>Leave Queue</Text>
                </Pressable>
            )}

            <Text style={styles.sectionTitle}>Waiting List</Text>

            <FlatList
                data={queues}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <Text style={{ color: "#999", textAlign: "center", marginTop: 10 }}>
                        No one in queue yet
                    </Text>
                }
                renderItem={({ item }) => (
                    <View style={[
                        styles.queueItem,
                        item.userId === currentUserId && styles.myQueueItem
                    ]}>
                        <Text style={styles.queueItemNumber}>#{item.queueNumber}</Text>
                        <Text style={styles.queueItemStatus}>{item.status}</Text>
                    </View>
                )}
            />

            {isAdmin && (
                <Pressable style={styles.adminButton} onPress={() => router.push("/(tabs)/adminScreen")}>
                    <Text style={styles.buttonText}>Admin Dashboard</Text>
                </Pressable>
            )}

            <Pressable style={styles.logoutButton} onPress={logout}>
                <Text style={styles.buttonText}>Logout</Text>
            </Pressable>
        </View>
    );
};

export default Queuing;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },

    myQueueCard: {
        backgroundColor: '#11ae09',
        padding: 25,
        borderRadius: 15,
        marginBottom: 20,
        alignItems: 'center',
    },

    queueText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },

    queueNumber: {
        color: "#fff",
        fontSize: 48,
        fontWeight: "bold",
        marginVertical: 10,
    },

    waitTimeText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: '500',
    },

    joinButton: {
        backgroundColor: "#11ae09",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },

    cancelButton: {
        backgroundColor: "#e30808",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },

    adminButton: {
        backgroundColor: "#1e90ff",
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
    },

    logoutButton: {
        backgroundColor: "#333",
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
    },

    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        marginTop: 10,
    },

    queueItem: {
        padding: 12,
        backgroundColor: "#f2f2f2",
        borderRadius: 8,
        marginBottom: 8,
        flexDirection: "row",
        justifyContent: "space-between",
    },

    myQueueItem: {
        backgroundColor: "#e8f5e9",
        borderLeftWidth: 4,
        borderLeftColor: "#11ae09",
    },

    queueItemNumber: {
        fontWeight: "bold",
        fontSize: 16,
    },

    queueItemStatus: {
        color: "#666",
        fontWeight: "500",
    },
});