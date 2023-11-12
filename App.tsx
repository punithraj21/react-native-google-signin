import React from 'react';

import {GoogleSignin} from '@react-native-community/google-signin';
import {NavigationContainer} from '@react-navigation/native';
import GoogleSignIns from './src/hooks/screens/GoogleSignIns';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DetailsScreen from './src/hooks/screens/Home';
import {HeaderBackButtonProps} from '@react-navigation/native-stack/lib/typescript/src/types';

GoogleSignin.configure({
  webClientId:
    '977614939982-nihf7qkmq6qksv5v5mduhmnnjrt2aq9f.apps.googleusercontent.com',
});

function HomeScreen({navigation}: any) {
  return <GoogleSignIns nav={navigation} />;
}

function App(): JSX.Element {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={HomeScreen} />
        <Stack.Screen
          name="Home"
          options={{
            headerBackVisible: false,
            headerTitleAlign: 'center',
            title: 'My Library',
          }}
          component={DetailsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
