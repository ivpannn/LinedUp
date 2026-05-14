import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { API } from "@/src/services/api";
import { getToken, removeToken } from "@/src/storage/token";

const Queuing = () => {

    const [queues, setQueues] = useState<any[]>([]);
    const [myQueue, setMyQueue] = useState<any>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

    // get all queues
    const fetchQueues = async () => {
        try {
            const token = await getToken();

            if (!token) return;

            // use token to know who making request and return user's queue number in response
            const response = await API.get("/queue", {
                headers: {
                    Authorization: token,
                },
            });

            setQueues(response.data.queue || [])
        } catch (error: any) {
            console.log("Error fetching queues:", error.response?.data || error.message);
        }
    };

    // logged in user's queue
    const fetchMyQueue = async () => {
        try {
            const token = await getToken();

            if (!token || !currentUserId) return;

            const response = await API.get("/queue", {
                headers: {
                    Authorization: token,
                },
            });

            // Get user's queue from the list by matching userId
            const queueList = response.data.queue || [];
            const userQueue = queueList.find((q: any) => q.userId === currentUserId);
            setMyQueue(userQueue || null);
        } catch (error: any) {
            console.log("Error fetching my queue:", error.response?.data || error.message);
        }
    };

    // join queue
    const joinQueue = async () => {
        try {
            const token = await getToken();

            if (!token) {
                alert("Please login first");
                return;
            }

            await API.post("/queue/join", {}, {
                headers: {
                    Authorization: token,
                },
            });

            fetchQueues();
            fetchMyQueue();

            alert("Joined queue");
        } catch (error: any) {
            alert(error.response?.data?.message || "Join queue failed");
        }
    };

    // cancel queue
    const cancelQueue = async () => {
        try {
            const token = await getToken();

            await API.post("/queue/leave", {}, {
                headers: {
                    Authorization: token,
                },
            });

            setMyQueue(null);
            fetchQueues();

            alert("Queue Cancelled");
        } catch (error: any) {
            alert(error.response?.data?.message || "Failed to cancel queue");
        }
    };

    const logout = async () => {
        await removeToken();
        router.push("/(auth)/login");
    };


    useEffect(() => {
        const getUserId = async () => {
            const token = await getToken();
            if (token) {
                try {
                    // Decode JWT to get userId (basic decode, no verification needed on client)
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));

                    const decoded = JSON.parse(jsonPayload);
                    setCurrentUserId(decoded.userId);
                    setIsAdmin(decoded.role === "ADMIN");
                } catch (error) {
                    console.log("Error decoding token:", error);
                    router.push("/(auth)/login");
                }
            } else {
                router.push("/(auth)/login");
            }
        };

        getUserId();
    }, []);

    useEffect(() => {
        if (currentUserId) {
            fetchQueues();
            fetchMyQueue();

            // Auto-refresh every 2 seconds
            const interval = setInterval(() => {
                fetchQueues();
                fetchMyQueue();
            }, 2000);

            return () => clearInterval(interval);
        }
    }, [currentUserId])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>LinedUp</Text>

            {myQueue && (
                <View style={styles.myQueueCard}>
                    <Text style={styles.queueText}>Your Queue Number</Text>
                    <Text style={styles.queueNumber}>#{myQueue.queueNumber}</Text>
                </View>
            )}

            {!myQueue && (
                <Pressable
                    style={styles.joinButton}
                    onPress={joinQueue}
                >
                    <Text style={styles.buttonText}>
                        Join Queue
                    </Text>
                </Pressable>
            )}

            {myQueue && (
                <Pressable
                    style={styles.cancelButton}
                    onPress={cancelQueue}
                >
                    <Text style={styles.buttonText}>Cancel Queue</Text>
                </Pressable>
            )}

            <Text style={styles.sectionTitle}>Current Queue</Text>

            <FlatList
                data={queues}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.queueItem}>
                        <Text>Queue #{item.queueNumber}</Text>
                        <Text>{item.status}</Text>
                    </View>
                )}
            />

            {isAdmin && (
                <Pressable
                    style={styles.adminButton}
                    onPress={() => router.push("/(tabs)/adminScreen")}
                >
                    <Text style={styles.buttonText}>Admin Dashboard</Text>
                </Pressable>
            )}

            <Pressable
                style={styles.logoutButton}
                onPress={logout}
            >
                <Text style={styles.buttonText}>Logout</Text>
            </Pressable>
        </View>
    );
}

export default Queuing;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
    },

    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
    },

    myQueueCard: {
        backgroundColor: 'green',
        padding: 30,
        borderRadius: 20,
        marginBottom: 20,
        alignItems: 'center',
    },

    queueText: {
        color: '#fff',
        fontSize: 18,
    },

    queueNumber: {
        color: "#fff",
        fontSize: 50,
        fontWeight: "bold",
        marginTop: 10,
    },

    joinButton: {
        backgroundColor: "green",
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
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },

    queueItem: {
        padding: 15,
        backgroundColor: "#f2f2f2",
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
})
