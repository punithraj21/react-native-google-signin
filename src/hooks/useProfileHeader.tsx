import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import { useNavigation } from "@react-navigation/native";

const useProfileHeader = (getLocalData: any, screen: any) => {
  const [signed, setSigned] = useState<any>("");
  const navigation: any = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      let user = await getLocalData();
      setSigned(user);
    };
    fetchData();
  }, [getLocalData]);

  React.useLayoutEffect(() => {
    if (signed?.photo) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate(screen)}>
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
  }, [navigation, signed]);
};

export default useProfileHeader;
