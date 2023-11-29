import React from "react";

import { GoogleSignin } from "@react-native-community/google-signin";
import { NavigationContainer } from "@react-navigation/native";
import GoogleSignIns from "./src/screens/GoogleSignIns";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DetailsScreen from "./src/screens/Home";
import Toast from "react-native-toast-message";
import { View } from "react-native";
import { Text } from "react-native";
import NotesDetail from "./src/screens/NotesDetail";
import UserDetail from "./src/screens/UserDetail";

GoogleSignin.configure({
  webClientId:
    "977614939982-nihf7qkmq6qksv5v5mduhmnnjrt2aq9f.apps.googleusercontent.com",
});

function HomeScreen({ navigation }: any) {
  return <GoogleSignIns nav={navigation} />;
}

function App(): JSX.Element {
  const Stack = createNativeStackNavigator();
  const toastConfig = {
    successs: ({ text1, props, ...rest }: any) => (
      <View
        style={{
          height: 40,
          backgroundColor: "#4CAF50",
          padding: 12,
          borderRadius: 12,
          justifyContent: "center",
          alignContent: "center",
        }}>
        <Text style={{ color: "white" }}>{text1}</Text>
      </View>
    ),
    error: ({ text1, props, ...rest }: any) => (
      <View style={{ height: 60, backgroundColor: "#F44336", padding: 16 }}>
        <Text style={{ color: "white" }}>{text1}</Text>
      </View>
    ),
  };

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={HomeScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Home"
            options={{
              headerBackVisible: false,
              headerTitleAlign: "left",
              headerTitleStyle: { color: "#444444" },
              headerStyle: {
                backgroundColor: "#fff",
              },
              title: "My Library",
            }}
            component={DetailsScreen}
          />
          <Stack.Screen
            name="NotesDetail"
            options={{
              title: "Details",
              headerTitleAlign: "center",
              headerTitleStyle: { color: "#444444" },
            }}
            component={NotesDetail}
          />
          <Stack.Screen
            name="UserDetail"
            options={{
              title: "User Detail",
              headerTitleAlign: "center",
              headerTitleStyle: { color: "#444444" },
            }}
            component={UserDetail}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  );
}

export default App;
