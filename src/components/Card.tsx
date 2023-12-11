import { useNavigation } from "@react-navigation/native";
import { get } from "lodash";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import WebView from "react-native-webview";

const Card = (props: any) => {
  const navigation: any = useNavigation();
  const createdAt = get(props, "data.createdAt", "");
  const date = new Date(createdAt.seconds * 1000 + createdAt.nanoseconds / 1e6);

  const options: any = {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedDate = date.toLocaleDateString("en-US", options);

  const handlePress = () => {
    navigation.navigate("NotesDetail", {
      noteData: props.data,
      refreshScreen: props.refreshScreen,
    });
  };
  const htmlContent = `
  <style>
    body {
      font-size: 60px;
    }
    html {
      overflow: hidden;
      margin: 0;
      padding: 0;
    }
  </style>
  ${props?.data?.data}
`;
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

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      {/* <WebView
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        style={{
          flex: 1,
          backgroundColor: "transparent",
        }}
        contentInset={{ top: 500, left: 100, bottom: 510, right: 10 }}
      /> */}
      <Text style={{ textAlign: "auto", color: "black" }}>
        {stripHtmlTags(props?.data?.data)}
      </Text>
      <Text style={{ textAlign: "auto", fontSize: 10 }}>{`${
        formattedDate ? formattedDate : ""
      }`}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "48%",
    height: 100,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#44868625",
    padding: 10,
    justifyContent: "space-between",
  },
});

export default Card;
