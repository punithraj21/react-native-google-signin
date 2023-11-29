import React, { useCallback, useEffect } from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from "react-native-vector-icons/AntDesign";
import useGoogleLogin from '../hooks/useGoogleLogin';
import useLocalStorageData from '../hooks/userAuth';

function GoogleSignIns(props: any) {
  const { onGoogleButtonPress } = useGoogleLogin();
  const { getLocalData } = useLocalStorageData();

  useEffect(() => {
    const fetchData = async () => {
      const user = await getLocalData();
      if (user) {
        props.nav.navigate('Home');
      }
    };
    fetchData();
  }, [getLocalData]);

  const onGoogleLogin = useCallback(async () => {
    const googleAuthResult = await onGoogleButtonPress();
    if (!googleAuthResult) {
      return;
    }
    props.nav.navigate('Home');
  }, [onGoogleButtonPress]);

  return (
    <LinearGradient colors={['#FFF', '#B8FF8630', '#B8FF86']} style={styles.main}>
      <Text style={styles.text}>
        {'"All your notes in one place"'}
      </Text>
      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={onGoogleLogin}
        >
          <Icon name="google" size={20} color="#000" />
          <Text style={{ color: 'black' }}>
            {'Sign in With Google'}
          </Text >
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    fontWeight: '400',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 50,
  },
  text: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 40,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
  }
});

export default GoogleSignIns;
