import { Redirect } from "expo-router"; //navigates without showing anything on screen

export default function Index() {
    return <Redirect href="/(auth)/login" />;
}