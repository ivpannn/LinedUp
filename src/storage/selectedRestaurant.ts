import AsyncStorage from "@react-native-async-storage/async-storage";

const SELECTED_RESTAURANT_KEY = "selectedRestaurant";

export interface SelectedRestaurant {
    id: string;
    name: string;
}

export const setSelectedRestaurant = async (restaurant: SelectedRestaurant) => {
    await AsyncStorage.setItem(SELECTED_RESTAURANT_KEY, JSON.stringify(restaurant)); //AsyncStorage only stores strings
    // JSON.stringify convert objects {id: "rest_2", name: "Shin zushi"} into the string '{"id": "rest_2", "name": "Shin zushi" }'so it can be store
};

export const getSelectedRestaurant = async (): Promise<SelectedRestaurant | null> => {
    const data = await AsyncStorage.getItem(SELECTED_RESTAURANT_KEY);
    return data ? JSON.parse(data) : null; //convert string back into JavaScript object when reading
    // null = user has not pick the restaurant yet 
};

export const clearSelectedRestaurant = async () => {
    await AsyncStorage.removeItem(SELECTED_RESTAURANT_KEY); //called on logout so the next user does not see the previous user's restaurant 
};
