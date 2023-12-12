import storage from "@react-native-firebase/storage";
import ImageResizer from "react-native-image-resizer";
import logErrorToFirestore from "./logErrorToFirestore";

const compressImage = async (
  uri: any,
  maxWidth: any,
  maxHeight: any,
  quality: any,
  format: any,
  rotation = 0,
) => {
  try {
    const response = await ImageResizer.createResizedImage(
      uri,
      maxWidth,
      maxHeight,
      format,
      quality,
      rotation,
    );
    return response.uri;
  } catch (err) {
    console.error(err);
    return null;
  }
};
const uploadImage = async (imageUri: any, user: any) => {
  const filename = `${new Date().getTime()}-${user.id}`;
  try {
    const compressedUri = await compressImage(
      imageUri,
      1200,
      1000,
      100,
      "JPEG",
    );
    if (!compressedUri) {
      return null;
    }
    await storage().ref(filename).putFile(compressedUri);
    const url = await storage().ref(filename).getDownloadURL();
    return url;
  } catch (e) {
    console.log("Error: Uploading Image", e);
    logErrorToFirestore(e);
    return null;
  }
};

export default uploadImage;
