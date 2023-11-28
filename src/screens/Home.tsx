import React, { useState, useCallback, useEffect, useRef } from "react";
import { ScrollView, View, Text, TextInput, StyleSheet } from "react-native";
import useLocalStorageData from "../hooks/userAuth";
import firestore from "@react-native-firebase/firestore";
import { Alert, Platform, BackHandler, RefreshControl } from "react-native";
import sendToast from "../components/Toast";
import CustomButton from "../components/CustomButton";
import Card from "../components/Card";
import LinearGradient from "react-native-linear-gradient";

function DetailsScreen(props: any) {
  const { clearUserData, getLocalData } = useLocalStorageData();
  const [signed, setSignIn] = useState<any>("");
  const [value, onChangeText] = useState<any>("");
  const [notes, setNotes] = useState<any>("");
  const lastBackPressedTime = useRef(0);

  const saveNotes = async () => {
    if (value.length < 1) {
      sendToast({ type: "info", text: "Your note is Empty!" });
      return;
    }
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
      const newNoteRef = await firestore().collection("Notes").add({
        id: nextId,
        data: value,
        user: signed.email,
        createdAt: new Date(),
      });

      const newNoteSnapshot = await newNoteRef.get();
      const newNoteData = newNoteSnapshot.data();

      setNotes((prevNotes: any) => [newNoteData, ...prevNotes]);

      sendToast({ type: "info", text: "Note added successfully!" });
      onChangeText("");
    } catch (error) {
      console.error("Error adding note:", error);
      Alert.alert("Error", "Failed to add note. Please try again.");
    }
  };

  const fetchData = async () => {
    const user = await getLocalData();

    const notes = await firestore()
      .collection("Notes")
      .where("user", "==", user.email)
      .orderBy("createdAt", "desc")
      .get();

    const finalNotes = notes.docs.map(doc => doc.data());
    setNotes(finalNotes);
    setSignIn(user);
    if (!user) {
      props.navigation.navigate("Login");
    }
  };

  useEffect(() => {
    fetchData();
    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", HandleBackPressed);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", HandleBackPressed);
      };
    }
  }, [getLocalData, props.navigation]);

  const HandleBackPressed = () => {
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - lastBackPressedTime.current;

    if (timeDifference < 2000) {
      BackHandler.exitApp();
    } else {
      sendToast({ type: "info", text: "Press again to close the app!" });
    }

    lastBackPressedTime.current = currentTime;
    return true;
  };

  const Logout = useCallback(async () => {
    await clearUserData();
    setSignIn(undefined);
    props.navigation.navigate("Login");
  }, []);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchData();
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <LinearGradient
      colors={["#f64f59", "#c471ed", "#12c2e9"]}
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
              <Text style={styles.bold}>Hi </Text>
              {`${
                signed?.email === "anuroopa910@gmail.com"
                  ? "Maharani (Baby)"
                  : signed?.email === "punithraj.tcs21@gmail.com"
                  ? "Bangaaru"
                  : signed.name
              }`}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>All your notes from </Text>
              {signed?.email}
            </Text>
          </>
        )}
        {notes && (
          <View style={styles.cardContainer}>
            {notes?.map((note: any, index: any) => (
              <Card key={index} data={note} />
            ))}
          </View>
        )}
      </ScrollView>
      <TextInput
        placeholderTextColor="#777"
        style={[
          styles.textArea,
          { height: Math.max(50, value.split("\n").length * 25) },
        ]}
        multiline
        numberOfLines={4}
        onChangeText={text => onChangeText(text)}
        value={value}
        placeholder="We are happy if you write!"
      />
      <View style={styles.buttonContainer}>
        <CustomButton title="Logout" onPress={Logout} color="#E85048" />
        <CustomButton
          title="Save"
          onPress={() => saveNotes()}
          color="#2FB031"
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
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
    backgroundColor: "#F6E2E1",
    fontSize: 16,
    textAlignVertical: "top",
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
