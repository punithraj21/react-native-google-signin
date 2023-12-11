import { useCallback, useState } from "react";
import { getLSData, removeLSData } from "./useLocalStorage";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-community/google-signin";

const useLocalStorageData = () => {
  const [user, setUser] = useState<any>("");
  const getLocalData = useCallback(async () => {
    const userData = await getLSData("user");
    setUser(userData);
    return userData;
  }, []);

  const clearUserData = useCallback(async () => {
    await removeLSData("user");
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    await auth().signOut();
  }, []);

  return { clearUserData, getLocalData, user };
};
export default useLocalStorageData;
