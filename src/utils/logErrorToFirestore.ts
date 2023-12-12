import firestore from "@react-native-firebase/firestore";
import { ERRORS } from "./collections";

const logErrorToFirestore = async (error: any) => {
  try {
    await firestore().collection(ERRORS).add({
      error: error.message,
      code: error.code,
      timestamp: firestore.FieldValue.serverTimestamp(),
    });
  } catch (firestoreError) {
    console.error("Error writing to Firestore: ", firestoreError);
  }
};

export default logErrorToFirestore;
