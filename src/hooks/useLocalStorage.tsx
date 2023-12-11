import AsyncStorage from "@react-native-async-storage/async-storage";

export const setLSData = async (key: any, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log("Error saving to LS :", error);
  }
};

export const getLSData = async (key: any) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? JSON.parse(value) : null;
  } catch (error) {
    console.log(`Error getting ${key} from LS :`, error);
  }
};

export const removeLSData = async (key: any) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(`Error removing ${key} from LS :`, error);
  }
};

export const updateLSData = async (key: any, value: any) => {
  try {
    const existingData: any = await AsyncStorage.getItem(key);

    let parsedData = JSON.parse(existingData);
    parsedData = value;
    await AsyncStorage.setItem(key, JSON.stringify(parsedData));
  } catch (error) {
    console.error("Error updating data", error);
  }
};
