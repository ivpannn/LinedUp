import AsyncStorage from "@react-native-async-storage/async-storage";

const SELECTED_RESTAURANT_KEY = "selectedRestaurant";

export interface SelectedRestaurant {
    id: string;
    name: string;
}

export const setSelectedRestaurant = async (restaurant: SelectedRestaurant) => {
    await AsyncStorage.setItem(SELECTED_RESTAURANT_KEY, JSON.stringify(restaurant));
};

export const getSelectedRestaurant = async (): Promise<SelectedRestaurant | null> => {
    const data = await AsyncStorage.getItem(SELECTED_RESTAURANT_KEY);
    return data ? JSON.parse(data) : null;
};

export const clearSelectedRestaurant = async () => {
    await AsyncStorage.removeItem(SELECTED_RESTAURANT_KEY);
};
