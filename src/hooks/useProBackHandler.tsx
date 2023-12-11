import { useEffect } from "react";
import { BackHandler } from "react-native";
import useProfileHeader from "./useProfileHeader";
import useLocalStorageData from "./useUserAuth";
import { useNavigation } from "@react-navigation/native";
import useBackButtonHandler from "./useBackHandler";

const useProBackHandler = () => {
  const navigation: any = useNavigation();
  const { getLocalData } = useLocalStorageData();
  useProfileHeader(getLocalData, "UserDetail");
  useBackButtonHandler(navigation);
};

export default useProBackHandler;
