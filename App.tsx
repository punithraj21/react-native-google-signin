/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import auth from '@react-native-firebase/auth';

import {GoogleSignin} from '@react-native-community/google-signin';
import {Button} from 'react-native';

GoogleSignin.configure({
  webClientId:
    '977614939982-nihf7qkmq6qksv5v5mduhmnnjrt2aq9f.apps.googleusercontent.com',
});

function GoogleSignIns() {
  const [signed, setSignIn] = useState<any>({
    email: '',
    name: '',
  });
  const [idToken, setIdToken] = useState('');
  async function onGoogleButtonPress() {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const {idToken} = await GoogleSignin.getTokens();
    setIdToken(idToken);
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const loggedInwithGoogle: any = await auth().signInWithCredential(
      googleCredential,
    );

    setSignIn({
      email: loggedInwithGoogle.additionalUserInfo.profile.email,
      name: loggedInwithGoogle.additionalUserInfo.profile.name,
    });
    // Sign-in the user with the credential
    return loggedInwithGoogle;
  }
  return (
    <>
      <Button
        title="Google Sign-In"
        onPress={() =>
          onGoogleButtonPress().then(() =>
            console.log('Signed in with Google!'),
          )
        }
      />
      <Text>ID TOKEN : {idToken}</Text>
      <Text>
        {' '}
        {'\n'} Successfully Signed IN : {JSON.stringify(signed)}
      </Text>
    </>
  );
}

// import auth from '@react-native-firebase/auth';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <GoogleSignIns />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
