import { useEffect } from "react";
import { BackHandler } from "react-native";

const useBackButtonHandler = (navigation: any) => {
  useEffect(() => {
    const onBackPress = () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }
      return false;
    };

    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  }, [navigation]);
};

export default useBackButtonHandler;
