import Toast from 'react-native-toast-message';

const sendToast = (props: any) => {
  try {
    Toast.show({
      type: props.type,
      text1: props.text,
    });
  } catch (error) {
    console.error('Error showing toast:', error);
  }
};

export default sendToast;
