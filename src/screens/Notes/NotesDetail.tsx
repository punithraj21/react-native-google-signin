import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
// import Clipboard from "@react-native-clipboard/clipboard";

import {
  Clipboard,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Share,
  ToastAndroid,
} from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";

import { firebase } from "@react-native-firebase/firestore";
import { Alert, BackHandler, Platform, Text, View } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { get } from "lodash";
import { NOTES } from "../../utils/collections";

const NotesDetail = ({ route }: any) => {
  const { noteData } = route.params;
  const navigation = useNavigation();
  const [editedData, setEditedData] = useState<any>(noteData.data);

  const handleDelete = async () => {
    try {
      const notesCollection = firebase.firestore().collection(NOTES);

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
          ToastAndroid.show("Note deleted.", ToastAndroid.SHORT);
        },
      },
    ]);
  };

  const stripHtmlTags = (html: any) => {
    // Replace line breaks, paragraph, and list tags with appropriate text
    let text = html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<p>/gi, "")
      .replace(/<ul>/gi, "")
      .replace(/<\/ul>/gi, "\n")
      .replace(/<ol>/gi, "")
      .replace(/<\/ol>/gi, "\n")
      .replace(/<li>/gi, "• ")
      .replace(/<\/li>/gi, "\n")
      .replace(/<[^>]*>?/gm, "") // Remove remaining HTML tags
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      // Add other HTML entities replacements as needed
      .trim();

    // Handle ordered list numbers
    const lines = text.split("\n");
    let isInOrderedList = false;
    let orderNumber = 1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("• ")) {
        if (isInOrderedList) {
          lines[i] = `${orderNumber}. ${lines[i].substring(2)}`;
          orderNumber++;
        }
      } else {
        isInOrderedList = false;
        orderNumber = 1;
      }

      if (lines[i].endsWith("•")) {
        isInOrderedList = true;
      }
    }

    return lines.join("\n");
  };

  const handleCopyText = () => {
    const strip = stripHtmlTags(editedData);
    Clipboard.setString(strip);
    ToastAndroid.show("Text copied to clipboard", ToastAndroid.SHORT);
  };

  const shareText = async (htmlContent: any) => {
    const textContent = stripHtmlTags(htmlContent);
    try {
      const result = await Share.share({
        message: textContent,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };
  useEffect(() => {
    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", handleBackPressed);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPressed);
      };
    }
  }, [navigation]);

  const updateFirebase = async (data: string) => {
    try {
      const notesCollection = firebase.firestore().collection(NOTES);

      const querySnapshot = await notesCollection
        .where("id", "==", noteData.id)
        .get();

      querySnapshot.forEach(async doc => {
        const noteDocument = notesCollection.doc(doc.id);
        await noteDocument.update({ data });
      });
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
            <MenuOption onSelect={() => handleCopyText()}>
              <Text style={{ padding: 10, color: "black" }}>Copy</Text>
            </MenuOption>
            <MenuOption onSelect={() => shareText(editedData)}>
              <Text style={{ padding: 10, color: "black" }}>Share</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      ),
    });
  }, [navigation]);

  return (
    <View style={{ backgroundColor: "#fff", height: "100%" }}>
      <TextEditor
        data={noteData}
        updateFirebase={updateFirebase}
        setEditedData={setEditedData}
      />
    </View>
  );
};

export default NotesDetail;

const handleHead = () => <Text style={{ fontSize: 20 }}>H1</Text>;

const TextEditor = ({ data, updateFirebase, setEditedData }: any) => {
  const [isEditorFocused, setEditorFocused] = React.useState(false);
  const richText: any = React.useRef();
  const createdAt = get(data, "createdAt", "");
  let date = new Date(createdAt.seconds * 1000 + createdAt.nanoseconds / 1e6);
  if (createdAt.length < 1) {
    date = new Date();
  }

  const options: any = {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedDate = date.toLocaleDateString("en-US", options);
  const customActions = {
    fontSizeIncrease: "fontSizeIncrease",
    fontSizeDecrease: "fontSizeDecrease",
  };

  const increaseFontSize = () => {
    richText.current?.injectJavaScript(`
      document.execCommand('fontSize', false, 'larger');
    `);
  };

  const decreaseFontSize = () => {
    richText.current?.injectJavaScript(`
      document.execCommand('fontSize', false, 'smaller');
    `);
  };

  const handleToolbarPress = (action: any) => {
    switch (action) {
      case customActions.fontSizeIncrease:
        increaseFontSize();
        break;
      case customActions.fontSizeDecrease:
        decreaseFontSize();
        break;
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setEditorFocused(false);

      return () => {
        setEditorFocused(false);
        richText.current?.blurContentEditor();
      };
    }, []),
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={"height"}
          style={{ flex: 1, padding: 20 }}>
          <Text style={{ marginBottom: "3%" }}>{formattedDate}</Text>
          <RichEditor
            onFocus={() => setEditorFocused(true)}
            onBlur={() => setEditorFocused(false)}
            initialContentHTML={data?.data}
            ref={richText}
            onChange={async text => {
              await updateFirebase(text);
              setEditedData(text);
            }}
          />
        </KeyboardAvoidingView>
      </ScrollView>
      {isEditorFocused && (
        <RichToolbar
          style={{
            backgroundColor: "transparent",
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
          editor={richText}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.heading1,
            actions.setUnderline,
            // actions.insertImage,
            actions.insertLink,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.undo,
            actions.redo,
            // actions.fontSize,
            // customActions.fontSizeIncrease,
            // customActions.fontSizeDecrease,
          ]}
          iconMap={{
            [actions.heading1]: handleHead,
            // [customActions.fontSizeIncrease]: () => <Text>A+</Text>,
            // [customActions.fontSizeDecrease]: () => <Text>A-</Text>,
          }}
          onPress={handleToolbarPress}
        />
      )}
    </SafeAreaView>
  );
};
