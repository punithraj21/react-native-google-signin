import React, { useState, useEffect, useCallback } from "react";
import {
  Alert,
  Pressable,
  Text,
  View,
  TouchableOpacity,
  AlertButton,
  Image,
} from "react-native";
import {
  Actions,
  Bubble,
  GiftedChat,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";
import firestore from "@react-native-firebase/firestore";
import Clipboard from "@react-native-clipboard/clipboard";
import { useNavigation } from "@react-navigation/native";
import { get } from "lodash";
import Icon from "react-native-vector-icons/Ionicons";

import { createMessage, listenToMessages } from "../../utils/messages";

// import { ImageIcon, PaperPlane, RoomInfo } from "~/assets/svg";

import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import uploadImage from "../../utils/uploadImage";
import useLocalStorageData from "../../hooks/useUserAuth";
import { GROUPS, MESSAGES } from "../../utils/collections";
import FastImage from "react-native-fast-image";

export default ({ route }: any) => {
  const navigation = useNavigation();
  const { getLocalData } = useLocalStorageData();

  const {
    _id: threadId,
    name,
    mainIntroduction,
    subIntroduction,
    executives,
    enteredUser,
    roomType,
    parsedName,
  } = route?.params.threadInfo;
  const [users, setUser] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      const user = await getLocalData();
      setUser(user);
    };
    fetchData();
  }, [navigation]);

  const [messages, setMessages] = useState([]);

  const [userNickname, setUserNickname] = useState("f");

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = useCallback(() => {
    setModalVisible(!isModalVisible);
  }, [isModalVisible]);

  const selectImage = () => {
    const options: any = {
      // Add any options you need
    };

    const handleImagePickerResponse = async (response: any) => {
      const user = await getLocalData();
      if (response.didCancel) {
        console.log("User cancelled image selection");
      } else if (response.errorCode) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else {
        const source = { uri: response.assets[0].uri };
        const ImageUrl: any = await uploadImage(source.uri, user);
        let text = "";
        createMessage(threadId, text, userNickname, ImageUrl, user);
      }
    };

    const showImagePicker = () => {
      launchImageLibrary(options, handleImagePickerResponse);
    };

    const showCamera = () => {
      launchCamera(options, handleImagePickerResponse);
    };

    Alert.alert(
      "Select",
      "Which image do you want to use?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Camera", onPress: () => showCamera() },
        { text: "Gallery", onPress: () => showImagePicker() },
      ],
      { cancelable: true },
    );
  };

  useEffect(() => {
    const unsubscribe = listenToMessages(threadId).onSnapshot(
      (querySnapshot: any) => {
        const formattedMessages: any = querySnapshot.docs.map((doc: any) => {
          return {
            _id: doc.id,
            text: "",
            createdAt: new Date().getTime(),
            user: {},
            ...doc.data(),
          };
        });

        setMessages(formattedMessages);
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: name,
    });
  }, [name, navigation, parsedName, toggleModal]);

  const onSend = useCallback(
    (newMessages: any) => {
      const text = newMessages[0].text;
      const image: any = "";
      createMessage(threadId, text, users.givenName, image, users);
    },
    [threadId, userNickname, users],
  );

  const handleLongPress = (message: any) => {
    const isUserMessage = users?.id === message?.user?._id;

    const buttons = [
      {
        text: "cancel",
        style: "cancel",
      },
      {
        text: "Copy",
        onPress: () => {
          Clipboard.setString(message?.text);
        },
      },
    ];

    if (isUserMessage) {
      buttons.push({
        text: "Delete",
        onPress: () => {
          messageDeleteDialog(message);
        },
      });
    }

    Alert.alert("Action", `${message?.text}`, buttons as AlertButton[], {
      cancelable: true,
    });
  };

  const messageDeleteDialog = (message: any) => {
    Alert.alert(
      "Caution!",
      "Are you sure you want to delete this message?",
      [
        { text: "cancel", style: "cancel" },
        { text: "delete", onPress: () => deleteMessage(message._id) },
      ],
      { cancelable: true },
    );
  };

  const renderCustomBubble = (props: any) => {
    const renderMessageText = () => {
      const { currentMessage } = props;
      return (
        <View>
          {currentMessage.user && currentMessage.user.name && (
            <Text>{currentMessage.user.name}</Text>
          )}
          <Bubble {...props} />
        </View>
      );
    };
    const currentMessage = get(props, "currentMessage", "");
    return (
      <TouchableOpacity onLongPress={() => handleLongPress(currentMessage)}>
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: "#6c75f5",
            },
            left: {
              backgroundColor: "#ffff",
            },
          }}
          onLongPress={() => handleLongPress(currentMessage)}
        />
      </TouchableOpacity>
    );
  };

  const deleteMessage = async (messageId: any) => {
    const messageRef = firestore()
      .collection(GROUPS)
      .doc(threadId)
      .collection(MESSAGES)
      .doc(messageId);

    try {
      await messageRef.delete();
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <View style={{ backgroundColor: "#e1f1f0", flex: 1 }}>
      <GiftedChat
        renderBubble={renderCustomBubble}
        messages={messages}
        onSend={onSend}
        renderActions={() => (
          <Actions
            onPressActionButton={selectImage}
            icon={() => <Icon name={"image"} size={25} color="#6c75f5" />}
          />
        )}
        renderInputToolbar={props => {
          return <InputToolbar {...props} />;
        }}
        renderSend={props => {
          return (
            <Send {...props}>
              <View
                style={{
                  width: 42,
                  height: 42,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 20,
                  marginRight: 10,
                }}>
                <Icon name={"send-outline"} size={25} color="#6c75f5" />
              </View>
            </Send>
          );
        }}
        renderAvatarOnTop={true}
        renderAvatar={counterUser => {
          if (!counterUser.currentMessage) {
            return <></>;
          }
          const nickname: any = counterUser.currentMessage.user
            .avatar as string;
          const roomUser: any = counterUser.currentMessage.user;
          return (
            <>
              {/* <View
                style={{
                  width: 32,
                  height: 32,
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 3,
                }}> */}
              <FastImage
                style={{ width: 30, height: 30, borderRadius: 20 }}
                source={{
                  uri: nickname,
                  cache: FastImage.cacheControl.web,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
              {/* </View> */}
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}>
                <Text
                  style={{
                    fontWeight: "light",
                    fontSize: 12,
                    color: "#565656",
                  }}>
                  {roomUser.name}
                </Text>
              </View>
            </>
          );
        }}
        user={{
          _id: users?.id,
        }}
      />
    </View>
  );
};
