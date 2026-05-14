import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface Restaurant {
    id: string;
    image: any;
    name: string;
    location: string;
    cuisineType: string;
    estimatedWait: number; // in minutes
}

const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => {

    const handleQueuePress = (restaurantId: string) => {
        // TODO: Store selected restaurant ID and navigate to queuing page
        router.push("/(tabs)/queuing");
    };

    return (
        <View style={styles.card}>
            <View style={styles.column}>
                <Image
                    source={restaurant.image}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={styles.row}>
                    <Text style={styles.name}>{restaurant.name}</Text>
                    <Text style={styles.details}>{restaurant.location}</Text>
                    <Text style={styles.details}>{restaurant.cuisineType}</Text>
                    <Text style={styles.wait}>Estimated Wait: {restaurant.estimatedWait} mins</Text>
                </View>
            </View>

            <Pressable
                style={styles.queueButton}
                onPress={() => {
                    console.log("Pressed");
                    handleQueuePress(restaurant.id);
                }}
            >
                <Text style={styles.buttonText}>Join queue</Text>
            </Pressable>
        </View>
    );
}

export default RestaurantCard;

const styles = StyleSheet.create({
    card: {
        flex: 1,
    },

    column: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },

    row: {
        flex: 1,
        marginLeft: 15,
    },

    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 5,
    },

    details: {
        fontSize: 14,
        color: '#555',
    },

    wait: {
        justifyContent: 'center',
        margin: 10,
        marginLeft: 0,
        fontSize: 16,
        color: 'red',
        fontWeight: 'bold',
    },

    queueButton: {
        justifyContent: 'center',
        alignSelf: 'flex-end',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'green',
        backgroundColor: '#11ae09',
        paddingVertical: 3,
        paddingHorizontal: 10,
    },

    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});