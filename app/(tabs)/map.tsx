import { StyleSheet, Text, View } from "react-native";

const Map = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Map</Text>
            <Text style={styles.placeholder}>Map view coming soon...</Text>
        </View>
    );
};

export default Map;

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
