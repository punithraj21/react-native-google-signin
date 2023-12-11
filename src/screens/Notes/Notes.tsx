import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";

import firestore from "@react-native-firebase/firestore";
import { get } from "lodash";
import {
  Alert,
  BackHandler,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import LinearGradient from "react-native-linear-gradient";
import Card from "../../components/Card";
import SkeletonView from "../../components/Skeleton";
import getGreetingBasedOnTime from "../../helperFunctions/getGreetingBasedOnTime";
import useLocalStorageData from "../../hooks/useUserAuth";
import { NOTES } from "../../utils/collections";

function DetailsScreen(props: any) {
  const hasImpersonate = get(props, "route.params.email", "");
  const { clearUserData, getLocalData } = useLocalStorageData();
  const navigation: any = useNavigation();
  const [signed, setSignIn] = useState<any>("");
  const [value, onChangeText] = useState<any>("");
  const [notes, setNotes] = useState<any>("");
  const lastBackPressedTime = useRef(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const saveNotes = async () => {
    try {
      const countersCollection = firestore().collection("counters");

      async function getNextId() {
        const counterDoc = await countersCollection.doc("notesCounter").get();

        if (!counterDoc.exists) {
          await countersCollection.doc("notesCounter").set({ value: 1 });
          return 1;
        }

        const nextId = counterDoc?.data()?.value + 1;
        await countersCollection.doc("notesCounter").update({ value: nextId });

        return nextId;
      }

      const nextId = await getNextId();
      const newNoteRef = await firestore().collection(NOTES).add({
        id: nextId,
        data: value,
        user: signed.email,
        createdAt: new Date(),
      });

      const newNoteSnapshot = await newNoteRef.get();
      const newNoteData = newNoteSnapshot.data();

      setNotes((prevNotes: any) => [newNoteData, ...prevNotes]);
      navigation.navigate("NotesDetail", {
        noteData: newNoteData,
        refreshScreen: refreshScreen,
      });

      // sendToast({ type: "info", text: "Note added successfully!" });
      onChangeText("");
    } catch (error) {
      console.error("Error adding note:", error);
      Alert.alert("Error", "Failed to add note. Please try again.");
    }
  };

  const fetchData = async (hasImpersonates: any) => {
    setIsLoading(true);
    let user = await getLocalData();

    if (hasImpersonates) {
      setSignIn({ ...user, email: hasImpersonates });
      user.email = hasImpersonates;
    }

    const notes = await firestore()
      .collection(NOTES)
      .where("user", "==", user.email)
      .orderBy("createdAt", "desc")
      .get();

    const finalNotes = notes.docs.map(doc => doc.data());
    setNotes(finalNotes);
    setSignIn(user);
    setIsLoading(false);
    if (!user) {
      props.navigation.navigate("Login");
    }
  };

  useEffect(() => {
    fetchData(hasImpersonate);
    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", HandleBackPressed);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", HandleBackPressed);
      };
    }
  }, [props.navigation]);

  const HandleBackPressed = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    }
    return false;
  };

  const refreshScreen = useCallback(() => {
    fetchData(hasImpersonate);
  }, [hasImpersonate]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      refreshScreen();
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, refreshScreen]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchData(hasImpersonate);
      setRefreshing(false);
    }, 2000);
  }, []);

  React.useLayoutEffect(() => {
    const updateNavigationOptions = () => {
      if (signed?.photo) {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity
              onPress={() => props.navigation.navigate("UserDetail")}>
              <FastImage
                style={{ width: 40, height: 40, borderRadius: 20 }}
                source={{
                  uri: signed.photo,
                  cache: FastImage.cacheControl.web,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            </TouchableOpacity>
          ),
        });
      }
    };

    updateNavigationOptions();
  }, [navigation, signed]);

  const greeting = getGreetingBasedOnTime();
  return (
    <LinearGradient
      colors={["#fff", "#DAF9FF", "#BEF4FF"]}
      style={{
        flex: 1,
        padding: 16,
      }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {signed && (
          <>
            <Text style={styles.text}>
              {"\n"}
              <Text style={styles.bold}>Hi there </Text>
              {greeting}
            </Text>
            {/* <Text style={styles.text}>
              <Text style={styles.bold}>All your notes from </Text>
              {signed?.email}
            </Text> */}
          </>
        )}
        {isLoading &&
          Array.from({ length: 8 }).map((_, index: number) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                display: "flex",
                marginVertical: 10,
              }}>
              <SkeletonView />
              <SkeletonView />
            </View>
          ))}
        {notes && !isLoading && (
          <View style={styles.cardContainer}>
            {notes?.map((note: any, index: any) => (
              <Card key={index} data={note} refreshScreen={refreshScreen} />
            ))}
          </View>
        )}
      </ScrollView>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => saveNotes()}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  buttonText: {
    fontSize: 30,
    color: "white",
    marginBottom: 3,
  },
  floatingButton: {
    position: "absolute",
    right: 30,
    bottom: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2FB031",
    borderRadius: 30,
    elevation: 5,
  },
  input: {
    margin: 12,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    margin: 12,
    padding: 10,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: "#F6E2E1",
    backgroundColor: "#fff",
    fontSize: 16,
    textAlignVertical: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 12,
  },
  text: {
    fontSize: 16,
    marginHorizontal: 14,
    marginBottom: 16,
  },
  bold: {
    padding: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  cardContainer: {
    marginHorizontal: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  button: {
    borderRadius: 8,
    padding: 20,
    margin: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default DetailsScreen;
