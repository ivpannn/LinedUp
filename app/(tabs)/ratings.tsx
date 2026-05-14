import { StyleSheet, Text, View } from "react-native";

const Rating = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ratings</Text>
            <Text style={styles.placeholder}>Ratings view coming soon...</Text>
        </View>
    );
};

export default Rating;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    placeholder: {
        fontSize: 16,
        color: "#999",
    },
});
