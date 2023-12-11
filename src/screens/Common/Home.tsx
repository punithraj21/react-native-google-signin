import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  Platform,
  Text,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import FastImage from "react-native-fast-image";
import useLocalStorageData from "../../hooks/useUserAuth";
import {
  AspectRatio,
  Box,
  Center,
  HStack,
  Heading,
  Image,
  Stack,
  View,
} from "native-base";

const Card = ({ image, title, desc, id }: any) => {
  const navigation: any = useNavigation();
  const handleSelect = (id: any) => {
    navigation.navigate(id);
  };

  return (
    <TouchableOpacity
      onPress={() => handleSelect(id)}
      style={{ marginTop: 15 }}>
      <Box alignItems="center">
        <Box
          maxW="68%"
          rounded="lg"
          overflow="hidden"
          borderColor="coolGray.200"
          borderWidth="1"
          _dark={{
            borderColor: "coolGray.600",
            backgroundColor: "gray.700",
          }}
          _web={{
            shadow: 2,
            borderWidth: 0,
          }}
          _light={{
            backgroundColor: "gray.50",
          }}>
          <Box>
            <AspectRatio w="100%" ratio={16 / 9}>
              <Image
                source={{
                  uri: image,
                }}
                alt="image"
              />
            </AspectRatio>
            {/* <Center
              bg="violet.500"
              _dark={{
                bg: "violet.400",
              }}
              _text={{
                color: "warmGray.50",
                fontWeight: "700",
                fontSize: "xs",
              }}
              position="absolute"
              bottom="0"
              px="3"
              py="1.5">
              PHOTOS
            </Center> */}
          </Box>
          <Stack p="4" space={3}>
            <Stack space={2}>
              <Heading size="md" ml="-1">
                {title}
              </Heading>
              <Text
                fontSize="xs"
                _light={{
                  color: "violet.500",
                }}
                _dark={{
                  color: "violet.400",
                }}
                fontWeight="500"
                ml="-0.5"
                mt="-1">
                {desc}
              </Text>
            </Stack>
            <HStack
              alignItems="center"
              space={4}
              justifyContent="space-between"></HStack>
          </Stack>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

const Home = () => {
  const navigation: any = useNavigation();
  const lastBackPressedTime = useRef(0);

  const { getLocalData } = useLocalStorageData();
  const [signed, setSigned] = useState<any>("");
  useEffect(() => {
    const fetchData = async () => {
      let user = await getLocalData();
      setSigned(user);
    };
    fetchData();
  }, []);

  const HandleBackPressed = () => {
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - lastBackPressedTime.current;

    if (timeDifference < 2000) {
      BackHandler.exitApp();
    } else {
      ToastAndroid.show("Press again to close the app!", ToastAndroid.SHORT);
    }

    lastBackPressedTime.current = currentTime;
    return true;
  };

  useEffect(() => {
    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", HandleBackPressed);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", HandleBackPressed);
      };
    }
  }, [navigation]);

  React.useLayoutEffect(() => {
    const updateNavigationOptions = () => {
      if (signed?.photo) {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate("UserDetail")}>
              <FastImage
                style={{ width: 40, height: 40, borderRadius: 20 }}
                source={{
                  uri: signed.photo,
                  cache: FastImage.cacheControl.web,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            </TouchableOpacity>
          ),
        });
      }
    };

    updateNavigationOptions();
  }, [navigation, signed]);
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          // flexWrap: "wrap",
          justifyContent: "space-around",
          maxWidth: "100%",
          // display: "flex",
        }}>
        <Card
          image={
            "https://firebasestorage.googleapis.com/v0/b/signinmas-9f718.appspot.com/o/713b90_7841ba78e810446f8765776b69ee76e3~mv2.png?alt=media&token=3b43000b-9306-4daa-854c-6e8845b3e41f"
          }
          title={"Chats"}
          desc={"Chat with your friends"}
          id={"Chats"}
        />
        <Card
          image={
            "https://firebasestorage.googleapis.com/v0/b/signinmas-9f718.appspot.com/o/notebook-pen-unsplash.jpg?alt=media&token=8333fa90-3b4d-49ef-96f8-4daafbbdb93b"
          }
          title={"Notes"}
          desc={"Note your thoughts"}
          id={"Notes"}
        />
        {/* <Card
          image={
            "https://firebasestorage.googleapis.com/v0/b/signinmas-9f718.appspot.com/o/Tasks.jpeg?alt=media&token=70d1804d-dea7-4eed-ab1d-81cb2b3b2bda"
          }
          title={"Tasks"}
          desc={"Your day Tasks"}
          id={"tasks"}
        /> */}
      </View>
    </>
  );
};

export default Home;
