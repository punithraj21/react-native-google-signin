import React, { useEffect, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native';
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
    <>
      <Text
        style={{
          fontWeight: '400',
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 12,
          marginTop: 80,
          margin: 40,
          textAlign: 'center',
          fontStyle: 'normal',
        }}
        onPress={onGoogleLogin}>
        {'Sign in With Google'}
      </Text>
    </>
  );
}
const styles = StyleSheet.create({
  button: {
    borderRadius: 0.5,
    padding: 85,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 12,
  },
});

export default GoogleSignIns;
