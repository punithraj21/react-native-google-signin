import React, {useState, useEffect, useCallback} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import {Text} from 'react-native';
import useGoogleLogin from '../useGoogleLogin';
import useLocalStorageData from '../userAuth';

function GoogleSignIns(props: any) {
  const {onGoogleButtonPress} = useGoogleLogin();
  const {getLocalData} = useLocalStorageData();

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
      <Text>
        {'\n'}
        {'\n'}
        {'\n'}
        {'\n'}
      </Text>

      <View style={styles.button}>
        <Button
          color="#81A6F5"
          title="Google Sign-In"
          onPress={onGoogleLogin}
        />
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  button: {
    borderRadius: 0.5,
    padding: 85,
    // backgroundColor: '#FFFF',
    color: '',
    // paddingVertical: 12,
    // paddingHorizontal: 40,
  },
});

export default GoogleSignIns;
