/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Pressable,
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
import {
  KakaoOAuthToken,
  login,
  getProfile as getKakaoProfile,
  shippingAddresses,
} from '@react-native-seoul/kakao-login';

GoogleSignin.configure({
  webClientId:
    '977614939982-nihf7qkmq6qksv5v5mduhmnnjrt2aq9f.apps.googleusercontent.com',
});

function GoogleSignIns() {
  const [signed, setSignIn] = useState<any>({
    email: '',
    name: '',
  });
  const [kakaoToken, setKakaoToken] = useState<any>();
  const [idToken, setIdToken] = useState('');

  async function onGoogleButtonPress() {
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signIn();
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

  const signInWithKakao = async (): Promise<void> => {
    const token: any = await login();
    setKakaoToken(token.idToken);

    const googleCredential = auth.OIDCAuthProvider.credential(
      'kakao',
      token.idToken,
    );

    const loggedInwithGoogle: any = await auth().signInWithCredential(
      googleCredential,
    );

    return loggedInwithGoogle;
  };
  return (
    <>
      <Button
        title="Kakao Login"
        onPress={() => {
          signInWithKakao();
        }}
      />

      <Button
        title="Google Sign-In"
        onPress={() =>
          onGoogleButtonPress().then(() =>
            console.log('Signed in with Google!'),
          )
        }
      />
      {idToken && <Text>ID TOKEN : {idToken}</Text>}
      {signed.email !== '' && (
        <Text>
          {' '}
          {'\n'} Successfully Signed IN : {JSON.stringify(signed)}
          {'\n'}
        </Text>
      )}
      {kakaoToken && (
        <Text>
          {'\n'}
          Kakao Token :{JSON.stringify(kakaoToken)}
        </Text>
      )}
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
