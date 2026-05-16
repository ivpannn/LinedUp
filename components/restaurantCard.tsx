import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface Restaurant {
    id: string;
    image: any;
    name: string;
    location: string;
    cuisineType: string;
    estimatedWait: number;
}

const RestaurantCard = ({
    restaurant,
    onPress,
    isAdmin
}: {
    restaurant: Restaurant;
    onPress: () => void;
    isAdmin: boolean;
}) => {

    return (
        <View style={styles.card}>
            <View style={styles.content}>
                <Image
                    source={restaurant.image}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={styles.info}>
                    <Text style={styles.name}>{restaurant.name}</Text>
                    <Text style={styles.details} numberOfLines={1}>{restaurant.location}</Text>
                    <Text style={styles.details}>{restaurant.cuisineType}</Text>
                    <Text style={styles.wait}>Est: {restaurant.estimatedWait} mins</Text>
                </View>
            </View>

            {!isAdmin && (
                <Pressable style={styles.queueButton} onPress={onPress}>
                    <Text style={styles.buttonText}>Join</Text>
                </Pressable>
            )}
        </View>
    );
}

export default RestaurantCard;

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },

    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },

    info: {
        flex: 1,
        marginLeft: 15,
    },

    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },

    details: {
        fontSize: 13,
        color: '#666',
        marginBottom: 3,
    },

    wait: {
        fontSize: 14,
        color: '#e30808',
        fontWeight: 'bold',
        marginTop: 8,
    },

    queueButton: {
        backgroundColor: '#11ae09',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginLeft: 10,
    },

    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
    },
});