import React from 'react';

import {GoogleSignin} from '@react-native-community/google-signin';
import {NavigationContainer} from '@react-navigation/native';
import GoogleSignIns from './src/screens/GoogleSignIns';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DetailsScreen from './src/screens/Home';
import Toast from 'react-native-toast-message';
import {View} from 'react-native';
import {Text} from 'react-native';

GoogleSignin.configure({
  webClientId:
    '977614939982-nihf7qkmq6qksv5v5mduhmnnjrt2aq9f.apps.googleusercontent.com',
});

function HomeScreen({navigation}: any) {
  return <GoogleSignIns nav={navigation} />;
}

function App(): JSX.Element {
  const Stack = createNativeStackNavigator();
  const toastConfig = {
    successs: ({text1, props, ...rest}: any) => (
      <View
        style={{
          height: 40,
          backgroundColor: '#4CAF50',
          padding: 12,
          borderRadius: 12,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <Text style={{color: 'white'}}>{text1}</Text>
      </View>
    ),
    error: ({text1, props, ...rest}: any) => (
      <View style={{height: 60, backgroundColor: '#F44336', padding: 16}}>
        <Text style={{color: 'white'}}>{text1}</Text>
      </View>
    ),
  };

  return (
    <>
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
      <Toast config={toastConfig} />
    </>
  );
}

export default App;
