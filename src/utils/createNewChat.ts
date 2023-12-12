import firestore from "@react-native-firebase/firestore";
import { GROUPS } from "./collections";

// export const updatePresident = async ({ threadId, uid }: any) => {
//   if (!threadId || !uid) {
//     return;
//   }
//   try {
//     await firestore()
//       .collection(MESSAGE_THREADS_COLLECTION)
//       .doc(threadId)
//       .update({
//         "executives.president": uid,
//       });
//     return { ok: true, error: null };
//   } catch (error) {
//     console.log("Error creating user entry in message thread: ", error);
//   }
// };

// export const updateIntroductions = async ({
//   uid,
//   threadId,
//   mainIntroduction,
//   subIntroduction,
// }: any) => {
//   if (!uid || !threadId) {
//     return;
//   }
//   try {
//     const pendingThread = await firestore()
//       .collection(MESSAGE_THREADS_COLLECTION)
//       .doc(threadId)
//       .get();
//     const resolvedThread = pendingThread.data();
//     if (!resolvedThread) {
//       return;
//     }
//     if (resolvedThread.executives.president !== uid) {
//       return { ok: false, error: "방장이 아닙니다" };
//     }
//     await firestore()
//       .collection(MESSAGE_THREADS_COLLECTION)
//       .doc(threadId)
//       .update({
//         mainIntroduction,
//         subIntroduction,
//       });

//     return { ok: true, error: null };
//   } catch (error) {
//     console.log("Error creating user entry in message thread: ", error);
//   }
// };

export const createNewThread = async ({
  uid,
  roomName,
  mainIntroduction,
  subIntroduction,
  roomKind,
  roomType,
  roomTypeDetail,
  image,
  name,
}: any) => {
  try {
    const newThreadRef = await firestore().collection(GROUPS).doc();

    const enteredUser = [uid];
    const initialExecutives = { president: uid };

    const makeThread: any = {
      _id: newThreadRef.id,
      roomKind,
      name: roomName,
      mainIntroduction,
      subIntroduction,
      roomType,
      roomTypeDetail: roomTypeDetail + "",
      executives: initialExecutives,
      enteredUser: enteredUser,
      totalMember: 0,
      image: image || null,
      createdBy: name,
      latestMessage: {
        text: `${name} Created Group`,
        createdAt: new Date(),
      },
    };

    await newThreadRef.set(makeThread);
    return newThreadRef;
  } catch (error) {
    console.log("Error creating new thread: ", error);
  }
};

// export const markThreadLastRead = async (threadId: any) => {
//   const user = currentUser();
//   try {
//     return await firestore()
//       .collection(USER_THREAD_TRACK_COLLECTION)
//       .doc(user?.uid)
//       .set(
//         {
//           [threadId]: getCurrentTimestamp(),
//         },
//         { merge: true },
//       );
//   } catch (error) {
//     console.log("Error marking thread last read: ", error);
//   }
// };

// export const listenToThreadTracking = ({
//   uid,
// }: {
//   uid: string | undefined;
// }) => {
//   if (!uid) {
//     return;
//   }

//   try {
//     return firestore().collection(USER_THREAD_TRACK_COLLECTION).doc(uid);
//   } catch (error) {
//     console.log("Error listening to thread tracking: ", error);
//   }
// };

// export const deleteThread = async ({ threadId }: { threadId: string }) => {
//   try {
//     await firestore()
//       .collection(MESSAGE_THREADS_COLLECTION)
//       .doc(threadId)
//       .delete();
//     return { ok: true, error: null };
//   } catch (error) {
//     console.log("Error deleting thread: ", error);
//     return { ok: false, error: error };
//   }
// };

// export const getThreadInfo = async ({ uid }: { uid: string | undefined }) => {
//   if (!uid) {
//     return;
//   }

//   try {
//     const userDoc = await firestore()
//       .collection(MESSAGE_THREADS_COLLECTION)
//       .doc(uid)
//       .get();
//     if (userDoc.exists) {
//       const { name, roomKind }: any = userDoc.data();
//       return { name, roomKind };
//     }
//   } catch (e) {
//     console.log("Error getting point: ", e);
//   }
// };

// export const createMandatoryThread = async ({
//   uid,
//   address,
// }: {
//   uid: string;
//   address: AddressType;
// }) => {
//   if (!uid || !address) {
//     return;
//   }
//   const userInfo = await getFbUser({ uid });
//   if (!userInfo || !userInfo.ok || !userInfo.data) {
//     return;
//   }
//   const { sex, bornyearValue } = userInfo.data;
//   const { sido, sigungu, eupmyeondong } = address;

//   const age = changeYearToAge(+bornyearValue);
//   const NEWS = changeLocationToNEWS(sido);

//   const userAge = age;
//   const userLocation = address.sido;
//   const userSex = sex;
//   const userNews = NEWS;
//   const tenYears = changeAgeToTenYears(+age);

//   const roomTypes = [
//     { type: "Location", detail: userLocation },
//     { type: "SameAge", detail: userAge },
//     { type: "TenYearsLocation", detail: `${tenYears}_${userLocation}` },
//     { type: "NEWS", detail: userNews },
//     {
//       type: "LocationSameAgeSex",
//       detail: `${userLocation}_${userAge}_${userSex}`,
//     },
//   ];

//   for (const roomType of roomTypes) {
//     const findRoomType = await firestore()
//       .collection(MESSAGE_THREADS_COLLECTION)
//       .where("roomTypeDetail", "==", roomType.detail + "")
//       .get();
//     if (findRoomType.empty) {
//       console.log("방이 없습니다. 새로 만듭니다.", roomType);
//       await createNewThread({
//         uid,
//         roomName: `${roomType.type}-${roomType.detail}`,
//         mainIntroduction: "-",
//         subIntroduction: "-",
//         roomKind: "-",
//         roomType: roomType.type,
//         roomTypeDetail: roomType.detail,
//       });
//     } else {
//       await userEntryInMessageThread({
//         uid,
//         threadId: findRoomType.docs[0].data()._id,
//       });
//       console.log("방이 있습니다. 안 만들고 로직을 끝냅니다.");
//     }
//   }
//   return { ok: true, error: null };
// };
