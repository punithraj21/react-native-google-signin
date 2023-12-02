import { useNavigation } from "@react-navigation/native";
import { get } from "lodash";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import WebView from "react-native-webview";

const Card = (props: any) => {
  const navigation = useNavigation();
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

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        style={{
          flex: 1,
          backgroundColor: "transparent",
        }}
        contentInset={{ top: 500, left: 100, bottom: 510, right: 10 }}
      />
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
