import React, { useState } from "react";
import { Text, TouchableOpacity, Image, View } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { Button, Input, Stack } from "native-base";
import FastImage from "react-native-fast-image";
import { createNewThread } from "../../utils/createNewChat";
import uploadImage from "../../utils/uploadImage";
import useLocalStorageData from "../../hooks/useUserAuth";
import logErrorToFirestore from "../../utils/logErrorToFirestore";
import { useNavigation } from "@react-navigation/native";

const CreateChatForm = () => {
  const [groupIcon, setGroupIcon] = useState<any>("");
  const [groupName, setGroupName] = useState<any>("");
  const [isLoading, setIsLoading] = useState<any>(false);
  const { getLocalData } = useLocalStorageData();
  const navigation: any = useNavigation();

  const selectImage = () => {
    const options: any = {};

    launchImageLibrary(options, (response: any) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else {
        const source: any = { uri: response.assets[0].uri };
        setGroupIcon(source);
      }
    });
  };

  const handleSubmit = async () => {
    const user = await getLocalData();
    setIsLoading(true);
    try {
      const imageUrl = await uploadImage(groupIcon?.uri || "", user);
      await createNewThread({
        uid: user.id,
        roomName: `${groupName}`,
        mainIntroduction: "-",
        subIntroduction: "-",
        roomKind: "-",
        roomType: "Group",
        roomTypeDetail: "Description",
        image:
          imageUrl ||
          "https://firebasestorage.googleapis.com/v0/b/signinmas-9f718.appspot.com/o/camera-icon-21.png?alt=media&token=69d662fd-f4ba-40c5-869a-7416ba41ccf9",
        name: user.givenName,
      });
    } catch (e) {
      console.log("Error: ", e);
      logErrorToFirestore(e);
    } finally {
      setIsLoading(false);
      navigation.navigate("Chats", {});
    }
  };

  return (
    <Stack w="100% " marginX={8}>
      <View
        style={{
          marginTop: 35,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
        <TouchableOpacity onPress={selectImage}>
          {groupIcon ? (
            <Image
              source={groupIcon}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
          ) : (
            <FastImage
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginLeft: 10,
              }}
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/signinmas-9f718.appspot.com/o/camera-icon-21.png?alt=media&token=69d662fd-f4ba-40c5-869a-7416ba41ccf9",
                cache: FastImage.cacheControl.web,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          )}
        </TouchableOpacity>
        <View style={{ width: "78%" }}>
          <Input
            variant="underlined"
            placeholder="Group Name.."
            onChangeText={(e: any) => {
              setGroupName(e);
            }}
          />
        </View>
      </View>
      <Button
        style={{ marginTop: 20 }}
        isLoading={isLoading}
        isLoadingText="Creating"
        onPress={handleSubmit}>
        Create
      </Button>
    </Stack>
  );
};

export default CreateChatForm;
