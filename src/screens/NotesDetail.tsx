import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  Platform,
} from "react-native";
import { Icon } from 'react-native-elements';
console.log("Icon: ", Icon);

const NotesDetail = ({ route }: any) => {
  const { noteData } = route.params;
  const navigation = useNavigation();
  const handleEditPress = () => {
    // Handle the logic for the "Edit" button press
    console.log("Edit button pressed");
  };

  useEffect(() => {
    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", HandleBackPressed);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", HandleBackPressed);
      };
    }
  }, [navigation]);
  const HandleBackPressed = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    }

    return false;
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 10,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 5,
            backgroundColor: "#007AFF",
          }}
          onPress={handleEditPress}>
          {/* <Icon name="edit" size={20} color="#000" /> */}
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  return (
    <View style={{ backgroundColor: "#fff", height: "100%" }}>
      <Text style={{ fontSize: 25, margin: 20, padding: 20 }}>
        {noteData.data}
      </Text>
    </View>
  );
};

export default NotesDetail;
