import AsyncStorage from "@react-native-async-storage/async-storage";

// store login token
export const saveToken = async (token: string) => {
    await AsyncStorage.setItem("token", token); // save a key-value pair to the phone's localStorage
    // "token" is the key, the JWT string is the value (Persist across app restarts)
};

// gets saved token
export const getToken = async () => {
    return await AsyncStorage.getItem("token"); // reads the value from the key "token"
    //returns null if nothing was saved
};

// logout
export const removeToken = async () => {
    await AsyncStorage.removeItem("token"); // so future API calls will fail auth
};
