import AsyncStorage from "@react-native-async-storage/async-storage";

// store login token
export const saveToken = async (token: string) => {
    await AsyncStorage.setItem("token", token);
};

// gets saved token
export const getToken = async () => {
    return await AsyncStorage.getItem("token");
};

// logout
export const removeToken = async () => {
    await AsyncStorage.removeItem("token");
};