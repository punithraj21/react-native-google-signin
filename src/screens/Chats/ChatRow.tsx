import { useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";

import { Pressable, StyleSheet, Text, View } from "react-native";
import formattedDate from "../../utils/formateDate";

export const Separator = () => <View style={styles.separator} />;

export const ChatRow = ({
  isUser,
  name,
  latestMessage,
  _id,
  mainIntroduction,
  subIntroduction,
  executives,
  enteredUser,
  roomType,
  roomKind,
  unread,
  roomTypeDetail,
  userId,
}: any) => {
  const navigation: any = useNavigation();

  const onPressWrapper = useCallback(() => {
    navigation.navigate("Messages", {
      threadInfo: {
        _id,
        mainIntroduction,
        subIntroduction,
        name,
        executives,
        enteredUser,
        roomType,
      },
    });
  }, [
    _id,
    enteredUser,
    executives,
    isUser,
    mainIntroduction,
    name,
    navigation,
    roomType,
    roomTypeDetail,
    subIntroduction,
  ]);

  const formatteDate = formattedDate(latestMessage.createdAt);
  return (
    <Pressable onPress={onPressWrapper}>
      <View style={styles.row}>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <View style={{ alignSelf: "center" }}>
            <Text style={{}}>{"logo"}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              display: "flex",
              width: "90%",
              justifyContent: "space-between",
            }}>
            <View style={styles.content}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                }}>
                <Text style={styles.contentText}>{"MainIntroduction"}</Text>
              </View>
              <View>
                <Text>{latestMessage.text}</Text>
              </View>
            </View>
            <View style={{ alignSelf: "flex-end" }}>
              <Text style={{ fontSize: 12 }}>{formatteDate}</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 14,
    borderRadius: 10,
  },
  content: {
    flexShrink: 1,
    marginLeft: 10,
  },
  header: {
    flexDirection: "row",
  },
  nameText: {},
  dateText: {},
  contentText: {
    top: -2,
    fontWeight: "900",
    color: "black",
    letterSpacing: 0.7,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "transparent",
    marginRight: 5,
  },
  dotUnread: {
    backgroundColor: "#2196F3",
  },
  separator: {
    height: 1,
    marginBottom: 5,
  },
});
