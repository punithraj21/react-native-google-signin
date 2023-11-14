import {StyleSheet, Text, TouchableOpacity} from 'react-native';

function CustomButton({title, onPress, color}: any) {
  return (
    <TouchableOpacity
      style={[styles.button, {backgroundColor: color}]}
      onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 12,
  },
  button: {
    borderRadius: 8,
    padding: 14,
    flex: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default CustomButton;
