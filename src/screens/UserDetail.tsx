import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";

import {
  BackHandler,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import useLocalStorageData from "../hooks/userAuth";
import FastImage from "react-native-fast-image";

function UserDetail(props: any) {
  const navigation = useNavigation();
  const { clearUserData, getLocalData } = useLocalStorageData();
  const [user, setUser] = useState<any>("");

  const fetchData = async () => {
    const user = await getLocalData();
    setUser(user);
    if (!user) {
      props.navigation.navigate("Login");
    }
  };

  const Logout = useCallback(async () => {
    await clearUserData();
    setUser(undefined);
    props.navigation.navigate("Login");
  }, []);

  useEffect(() => {
    fetchData();
    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", handleBackPressed);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPressed);
      };
    }
  }, [navigation]);

  const handleBackPressed = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    }
    return false;
  };

  return (
    <LinearGradient
      colors={["#FFF", "#FFF0F0", "#FEBDBD"]}
      style={styles.main1}>
      <View style={styles.main}>
        {user && (
          <>
            <FastImage
              style={{ width: 150, height: 150, borderRadius: 100 }}
              source={{ uri: user.photo, cache: FastImage.cacheControl.web }}
              resizeMode={FastImage.resizeMode.contain}
            />
            <Text style={styles.text}>{user.name}</Text>
            <Text style={{ fontSize: 20, marginTop: 10 }}>{user.id}</Text>
            <Text style={{ fontSize: 20, marginTop: 10 }}>{user.email}</Text>
          </>
        )}
      </View>
      <TouchableOpacity
        onPress={Logout}
        style={{
          backgroundColor: "red",
          marginBottom: 150,
          alignItems: "center",
          width: "40%",
          alignSelf: "center",
          padding: 10,
          borderRadius: 10,
        }}>
        <Text
          style={{
            color: "white",
            fontSize: 20,
          }}>
          Logout
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: "center",
    paddingTop: 100,
  },
  main1: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    fontSize: 30,
    marginTop: 20,
    color: "black",
  },
});

export default UserDetail;
