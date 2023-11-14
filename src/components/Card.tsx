import {
  ScrollView,
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
} from 'react-native';

const Card = ({data}: any) => {
  return (
    <View style={styles.card}>
      <Text numberOfLines={4} ellipsizeMode="tail">
        {data}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  card: {
    width: '48%',
    height: 100,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#ECE8E7',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    padding: 10,
  },
});

export default Card;
