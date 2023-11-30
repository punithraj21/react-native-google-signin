import { useNavigation } from "@react-navigation/native";
import { get } from "lodash";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const Card = (props: any) => {
  const navigation = useNavigation();
  const createdAt = get(props, "data.createdAt", "");
  const date = new Date(createdAt.seconds * 1000 + createdAt.nanoseconds / 1e6);

  const options = {
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

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Text style={{ color: "#444444" }} numberOfLines={4} ellipsizeMode="tail">
        {props.data.data}
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
