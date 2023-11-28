import { useNavigation } from "@react-navigation/native";
import {
  ScrollView,
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const Card = (props: any) => {
  const navigation = useNavigation();

  const handlePress = () => {
    console.log(props.data);
    navigation.navigate("NotesDetail", {
      noteData: props.data,
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Text style={{ color: "#444444" }} numberOfLines={4} ellipsizeMode="tail">
        {props.data.data}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "48%",
    height: 100,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#ffffff29",
    padding: 10,
  },
});

export default Card;
