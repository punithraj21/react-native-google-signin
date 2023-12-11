import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";

import {
  BackHandler,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import useLocalStorageData from "../../hooks/useUserAuth";
import FastImage from "react-native-fast-image";
import SearchableDropdown from "react-native-searchable-dropdown";
import { updateLSData } from "../../hooks/useLocalStorage";

const Dropdown = ({ allUsers }: any) => {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigation: any = useNavigation();

  const onSearch = (query: any) => {
    const filteredData = allUsers?.filter((user: any) =>
      user.name.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredUsers(filteredData);
  };

  const handleSelect = (item: any) => {
    const userData = {
      id: item.id,
      name: item.name,
      email: item.name,
      photo: item.photo,
    };
    updateLSData("user", userData);
    navigation.navigate("Notes", {
      email: item.name,
    });
  };

  return (
    <SearchableDropdown
      onTextChange={onSearch}
      onItemSelect={(item: any) => {
        handleSelect(item);
      }}
      containerStyle={{ padding: 5, marginTop: 10, width: "80%" }}
      textInputStyle={{
        padding: 12,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
      }}
      itemStyle={{
        padding: 10,
        marginTop: 2,
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderWidth: 1,
        borderRadius: 5,
      }}
      itemTextStyle={{ color: "#222" }}
      itemsContainerStyle={{ maxHeight: 140 }}
      items={filteredUsers}
      placeholder="Impersonate"
      resetValue={false}
      underlineColorAndroid="transparent"
    />
  );
};

function UserDetail(props: any) {
  const navigation = useNavigation();
  const { clearUserData, getLocalData } = useLocalStorageData();
  const [user, setUser] = useState<any>("");

  const Logout = useCallback(async () => {
    await clearUserData();
    setUser(undefined);
    props.navigation.navigate("Login");
  }, []);

  const [allUsers, setAllUsers] = useState([]);

  const fetchUsers = async () => {
    const user = await getLocalData();
    setUser(user);
    if (!user) {
      props.navigation.navigate("Login");
    }
    try {
      const querySnapshot = await firestore().collection("Users").get();

      const users: any = querySnapshot.docs.map(doc => {
        const userData = doc.data();
        return { id: doc.id, name: userData.email, photo: userData.photo };
      });

      setAllUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
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
            <Dropdown allUsers={allUsers} />
          </>
        )}
        <TouchableOpacity
          onPress={Logout}
          style={{
            backgroundColor: "red",
            marginTop: 100,
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
              position: "relative",
            }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
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
