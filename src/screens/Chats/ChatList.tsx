import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useProBackHandler from "../../hooks/useProBackHandler";
import { listenToFreeThreads } from "../../utils/messages";
import { ChatRow } from "./ChatRow";

const ChatList = () => {
  const [groups, setGroups] = useState<any>([]);
  useProBackHandler();
  const navigation: any = useNavigation();

  const createNewChat = () => {
    navigation.navigate("CreateChat");
  };

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const result = await listenToFreeThreads();
        if (!result) {
          return;
        }

        const unsubscribe = result.onSnapshot(querySnapshot => {
          if (!querySnapshot) return;
          const allThreads = querySnapshot.docs.map(snapshot => {
            return {
              _id: snapshot.id,
              name: "",
              latestMessage: { createdAt: 0, text: "" },
              mainIntroduction: "",
              roomKind: "",
              roomType: "",
              subIntroduction: "",
              executives: { president: "" },
              enteredUser: [""],
              ...snapshot.data(),
            };
          });

          setGroups([...allThreads]);
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.log("Failed to fetch mandatory threads: ", { error });
      }
    };

    fetchThreads();
  }, []);
  const Separator = () => <View style={styles.separator} />;
  const renderItem = useCallback(({ item }: { item: any }) => {
    console.log("item: ", item);
    return (
      <View>
        <ChatRow {...item} />
      </View>
    );
  }, []);

  return (
    <>
      <SafeAreaView>
        <View style={{ paddingHorizontal: 10, paddingBottom: 50 }}>
          <FlatList
            data={groups}
            renderItem={renderItem}
            style={{ marginVertical: 10 }}
            ItemSeparatorComponent={() => <Separator />}
          />
        </View>
      </SafeAreaView>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => createNewChat()}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  separator: {
    height: 1,
    marginBottom: 5,
  },
  buttonText: {
    fontSize: 30,
    color: "white",
    marginBottom: 3,
  },
  floatingButton: {
    position: "absolute",
    right: 30,
    bottom: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2FB031",
    borderRadius: 30,
    elevation: 5,
  },
  input: {
    margin: 12,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    margin: 12,
    padding: 10,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: "#F6E2E1",
    backgroundColor: "#fff",
    fontSize: 16,
    textAlignVertical: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 12,
  },
  text: {
    fontSize: 16,
    marginHorizontal: 14,
    marginBottom: 16,
  },
  bold: {
    padding: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  cardContainer: {
    marginHorizontal: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  button: {
    borderRadius: 8,
    padding: 20,
    margin: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default ChatList;
