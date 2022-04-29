import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Auth} from 'aws-amplify';
import {Picker} from '@react-native-picker/picker';
import {DataStore} from '@aws-amplify/datastore';

import {User} from '../models';
const ProfileScreen = () => {
  const [name, setName] = React.useState<string>('');
  const [bio, setBio] = React.useState<string>('');
  const [gender, setGender] = React.useState();
  const [lookingFor, setLookingFor] = React.useState();

  const isValid = () => {
    return name && bio && gender && lookingFor;
  };

  const save = async () => {
    if (!isValid()) {
      console.warn('Not valid');
      return;
    }

    // const user = await Auth.currentAuthenticatedUser();

    const newUser = new User({
      name: name,
      image:
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/elon.png',
      bio: bio,
      gender: gender,
      lookingFor: lookingFor,
    });
    console.log(newUser);

    await DataStore.save(newUser);
    
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Name.."
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Bio.."
          multiline
          numberOfLines={3}
          value={bio}
          onChangeText={setBio}
        />
        <Text>Gender</Text>
        <Picker
          selectedValue={gender}
          onValueChange={ItemValue => setGender(ItemValue)}
          accessibilityLabel="Gender">
          <Picker.Item label="Male" value={'MALE'} />
          <Picker.Item label="Female" value={'FEMALE'} />
          <Picker.Item label="Other" value={'OTHER'} />
        </Picker>

        <Text>Looking for</Text>
        <Picker
          selectedValue={lookingFor}
          onValueChange={ItemValue => setLookingFor(ItemValue)}>
          <Picker.Item label="Male" value={'MALE'} />
          <Picker.Item label="Female" value={'FEMALE'} />
          <Picker.Item label="Other" value={'OTHER'} />
        </Picker>

        <TouchableOpacity onPress={save} style={styles.button}>
          <Text>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Auth.signOut()} style={styles.button}>
          <Text>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    padding: 10,
    flex: 1,
  },
  container: {
    padding: 10,
  },
  input: {
    margin: 10,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  button: {
    backgroundColor: '#f63a6e',
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 10,
  },
});
