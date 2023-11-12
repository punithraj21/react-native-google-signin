import React, {useState, useCallback, useEffect} from 'react';
import {
  ScrollView,
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
} from 'react-native';
import useLocalStorageData from '../userAuth';
import firestore from '@react-native-firebase/firestore';
import {Alert} from 'react-native';

function DetailsScreen(props: any) {
  const {clearUserData, getLocalData} = useLocalStorageData();
  const [signed, setSignIn] = useState<any>('');
  const [value, onChangeText] = useState<any>('');
  const [notes, setNotes] = useState<any>('');

  const saveNotes = async () => {
    try {
      const newNoteRef = await firestore().collection('Notes').add({
        data: value,
        user: signed.email,
      });

      const newNoteSnapshot = await newNoteRef.get();
      const newNoteData = newNoteSnapshot.data();

      setNotes((prevNotes: any) => [...prevNotes, newNoteData]);

      console.log('Note added successfully!');
      Alert.alert('Success', 'Note added successfully!');
    } catch (error) {
      console.error('Error adding note:', error);
      Alert.alert('Error', 'Failed to add note. Please try again.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = await getLocalData();
      console.log('user: ', user.email);

      const notes = await firestore()
        .collection('Notes')
        .where('user', '==', user.email)
        .get();

      const finalNotes = notes.docs.map(doc => doc.data());
      setNotes(finalNotes);
      setSignIn(user);
      if (!user) {
        props.navigation.navigate('Login');
      }
    };
    fetchData();
  }, [getLocalData]);

  const Logout = useCallback(async () => {
    await clearUserData();
    setSignIn(undefined);
    props.navigation.navigate('Login');
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {signed && (
        <>
          <Text style={styles.text}>
            {'\n'}
            <Text style={styles.bold}>Name : </Text>
            {signed?.name}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Email : </Text>
            {signed?.email}
          </Text>
        </>
      )}
      {notes && (
        <View style={styles.cardContainer}>
          {notes?.map((note: any) => (
            <View key={note.id} style={styles.card}>
              <Text>{note.data}</Text>
            </View>
          ))}
        </View>
      )}
      <TextInput
        style={styles.textArea}
        multiline
        onChangeText={text => onChangeText(text)}
        value={value}
        placeholder="Input your text here"
      />

      <View style={styles.button}>
        <Button title="Logout" onPress={Logout} />
        <Button title="Save" onPress={() => saveNotes()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  input: {
    margin: 12,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 120,
    margin: 12,
    padding: 10,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
  },
  text: {
    fontSize: 16,
    marginHorizontal: 14,
    marginBottom: 16,
  },
  bold: {
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardContainer: {
    marginHorizontal: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '30%',
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
  button: {
    borderRadius: 0.5,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default DetailsScreen;
