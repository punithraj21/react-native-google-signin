import React from "react";
import { Center, HStack, Skeleton, VStack } from "native-base";

const SkeletonView = () => {
  return (
    <Center w="50%">
      <HStack
        w="90%"
        h="100"
        maxW="400"
        borderWidth="1"
        space={8}
        rounded="md"
        _dark={{
          borderColor: "coolGray.500",
        }}
        _light={{
          borderColor: "coolGray.200",
        }}
        p="4">
        {/* <Skeleton flex="1" h="150" rounded="md" startColor="coolGray.100" /> */}
        <VStack flex="3" space="4">
          {/* <Skeleton startColor="coolGray.300" /> */}
          <Skeleton.Text />
          <HStack space="2" alignItems="center">
            {/* <Skeleton size="5" rounded="full" /> */}
            {/* <Skeleton h="3" flex="2" rounded="full" /> */}
            {/* <Skeleton h="3" flex="1" rounded="full" startColor="coolGray.300" /> */}
          </HStack>
        </VStack>
      </HStack>
    </Center>
  );
};

export default SkeletonView;
