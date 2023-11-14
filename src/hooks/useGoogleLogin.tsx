import { GoogleSignin } from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import { setLSData } from './useLocalStorage';
import { useCallback } from 'react';

const useGoogleLogin = () => {
  const onGoogleButtonPress = useCallback(async () => {
    await GoogleSignin.hasPlayServices();
    const userProfile = await GoogleSignin.signIn();
    setLSData('user', userProfile.user);
    const { idToken } = await GoogleSignin.getTokens();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return auth().signInWithCredential(googleCredential);
  }, []);
  return { onGoogleButtonPress };
};

export default useGoogleLogin;
