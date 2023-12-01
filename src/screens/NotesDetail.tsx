import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";

import { firebase } from "@react-native-firebase/firestore";
import {
  Alert,
  BackHandler,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

const NotesDetail = ({ route }: any) => {
  const { noteData } = route.params;
  const navigation = useNavigation();
  const [editData, setEditData] = useState(noteData.data);
  console.log("editData: ", editData);

  const handleDelete = async () => {
    try {
      const notesCollection = firebase.firestore().collection("Notes");

      const querySnapshot = await notesCollection
        .where("id", "==", noteData.id)
        .get();

      querySnapshot.forEach(async doc => {
        const noteDocument = notesCollection.doc(doc.id);
        await noteDocument.delete();
      });
    } catch (error) {
      console.error("Error updating documents:", error);
    }
  };

  const handleEditPress = () => {
    Alert.alert("Are you sure?", "Once you delete you can get it back.", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancelled"),
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          handleDelete();
          handleBackPressed();
        },
      },
    ]);
  };

  useEffect(() => {
    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", handleBackPressed);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPressed);
      };
    }
  }, [navigation]);

  const updateFirebase = async (data :string) => {
    try {
      const notesCollection = firebase.firestore().collection("Notes");

      const querySnapshot = await notesCollection
        .where("id", "==", noteData.id)
        .get();

      querySnapshot.forEach(async doc => {
        const noteDocument = notesCollection.doc(doc.id);
        await noteDocument.update({ data });
      });

      setEditData(data);
    } catch (error) {
      console.error("Error updating documents:", error);
    }
  };
  const handleBackPressed = () => {
    if (navigation.canGoBack()) {
      route.params.refreshScreen();
      navigation.goBack();
      return true;
    }
    return false;
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Menu>
          <MenuTrigger
            customStyles={{
              triggerTouchable: {
                borderRadius: 20,
              },
            }}>
            <Text style={{ fontSize: 28, padding: 10 }}>⋮</Text>
          </MenuTrigger>
          <MenuOptions
            customStyles={{
              optionsContainer: {
                marginTop: 50,
                borderRadius: 10,
              },
            }}>
            <MenuOption onSelect={() => handleEditPress()}>
              <Text style={{ padding: 10, color: "black" }}>Delete</Text>
            </MenuOption>
            {/* <MenuOption onSelect={() => Alert.alert("Option 2")}>
              <Text style={{ padding: 10, color: "black" }}>Option 2</Text>
            </MenuOption> */}
          </MenuOptions>
        </Menu>
      ),
    });
  }, [navigation]);

  return (
    <View style={{ backgroundColor: "#fff", height: "100%" }}>
      <TextInput
        multiline
        onChangeText={async text => {
          await updateFirebase(text);
        }}
        style={{
          fontSize: 20,
          margin: 10,
          padding: 10,
          height: "100%",
          textAlignVertical: "top",
          lineHeight: 30,
        }}>
        {noteData.data}
      </TextInput>
    </View>
  );
};

export default NotesDetail;
