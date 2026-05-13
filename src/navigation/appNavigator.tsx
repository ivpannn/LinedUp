import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "@/app/(auth)/login";
import Register from "@/app/(auth)/register";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return(
        <NavigationContainer>
            <Stack.Navigator> 
                {/* work like pages */}
                <Stack.Screen
                    name="Login"
                    component={Login}
                />
                <Stack.Screen
                    name="Register"
                    component={Register}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
};

export default AppNavigator;