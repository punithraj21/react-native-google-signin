import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import {
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  Platform,
  Alert,
  Modal,
  TextInput,
  Button,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { firebase } from "@react-native-firebase/firestore";
import CustomButton from "../components/CustomButton";

const NotesDetail = ({ route }: any) => {
  const { noteData } = route.params;
  console.log("noteData: ", noteData);
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [editData, setEditData] = useState("");

  const showEditDialog = () => {
    setEditData(noteData.data);
    setModalVisible(true);
  };

  const handleEditPress = () => {
    Alert.alert(
      "Choose from Below!",
      "You can select any option based on your choice",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancelled"),
          style: "cancel",
        },
        { text: "Edit", onPress: showEditDialog },
        { text: "Delete", onPress: () => console.log("Delete Pressed") },
      ],
    );
  };

  useEffect(() => {
    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", handleBackPressed);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPressed);
      };
    }
  }, [navigation]);

  const updateFirebase = async () => {
    try {
      const notesCollection = firebase.firestore().collection("notes");

      const querySnapshot = await notesCollection
        .where("id", "==", noteData.id)
        .get();

      // Update each matching document with the new data
      querySnapshot.forEach(async doc => {
        const noteDocument = notesCollection.doc(doc.id);
        const resp = await noteDocument.update(editData);
        console.log("resp: ", resp);
      });

      console.log("Documents updated successfully");
    } catch (error) {
      console.error("Error updating documents:", error);
    }
  };
  const handleBackPressed = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    }
    return false;
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleEditPress}>
          <Icon name="edit" size={20} color="#777" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={{ backgroundColor: "#fff", height: "100%" }}>
      <Text style={{ fontSize: 25, margin: 20, padding: 20 }}>
        {noteData.data}
      </Text>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={{
            backgroundColor: "#EFFFFE",
            borderRadius: 12,
            position: "absolute",
            top: "42%",
            right: "15%",
            left: "15%",
            bottom: "45%",
            padding: 20,
            justifyContent: "center",
            borderColor: "gray",
          }}>
          <TextInput
            multiline
            numberOfLines={4}
            style={[
              styles.textArea,
              { height: Math.max(50, editData.split("\n").length * 25) },
            ]}
            onChangeText={text => setEditData(text)}
            value={editData}
          />
          {/* <Button
            title="Confirm Edit"
            onPress={() => {
              console.log("Edited Data:", editData);
              updateFirebase;
              setModalVisible(false);
            }}
          /> */}
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Cancel"
              onPress={() => setModalVisible(false)}
              color="red"
            />
            <CustomButton
              title="Change"
              onPress={() => updateFirebase()}
              color="#2FB031"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  textArea: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: "#A5B6B5",
    backgroundColor: "#EFFFFE",
    fontSize: 16,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default NotesDetail;
