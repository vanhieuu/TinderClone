import {StyleSheet, View} from 'react-native';
import React from 'react';
import AnimatedStack from '../components/AnimatedStack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {DataStore} from '@aws-amplify/datastore';
import {Match, User} from '../models';
import {Auth} from 'aws-amplify';

const HomeScreen = () => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [currentUser, setCurrentUser] = React.useState<User>(null);
  const [authenticatedUser, setAuthenticatedUser] = React.useState<User>(null);
  React.useEffect(() => {
    const getCurrentUser = async () => {
      const users = await Auth.currentAuthenticatedUser();
      const dbUsers = await DataStore.query(User, u =>u.sub('eq',users.attributes.sub));

      if (  dbUsers.length === 0) {
        return;
      }

      setAuthenticatedUser(dbUsers[0]);
    };

    getCurrentUser();
  }, []);

  React.useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await DataStore.query(User);
      setUsers(fetchedUser);
    };
    fetchUser();
  }, []);

  const onSwipeLeft = () => {
    if (!currentUser || !authenticatedUser) {
      return;
    }
    console.warn('swipeLeft', currentUser.name);
  };
  const onSwipeRight = async () => {
    if (!currentUser || !authenticatedUser) {
      return;
    }
    const myMatches = await DataStore.query(Match,match =>(
          match.User1ID('eq' ,authenticatedUser.id).User2ID('eq', currentUser.id)
    ))
      if(myMatches.length > 0) {

        console.log('You already swiped right to this user')
        return;
      }
    const currentUserMatches = await DataStore.query(Match,match =>(
      match.User1ID('eq' ,currentUser.id).User2ID('eq', authenticatedUser.id)
))

      if( currentUserMatches.length > 0) {
        console.log('Yay, this is new Match');
        const currentMatches = currentUserMatches[0];
        DataStore.save(Match.copyOf(currentMatches,update => {
            update.isMatch = true
        }))
        return;
      }
      console.warn('Sending him a match request !')

    DataStore.save(
      new Match({
        User1ID: authenticatedUser.id,
        User2ID: currentUser.id,
        isMatch: false,
      }),
    );
    
  };

  return (
    <View style={styles.pageContainer}>
      <AnimatedStack
        data={users}
        onSwipeLeft={onSwipeLeft}
        setCurrentUser={setCurrentUser}
        onSwipeRight={onSwipeRight}
      />
      <View style={styles.icons}>
        <View style={styles.button}>
          <FontAwesome name="undo" size={24} color="#FBD88B" />
        </View>
        <View style={styles.button}>
          <Entypo name="cross" size={24} color="#F76C6B" />
        </View>
        <View style={styles.button}>
          <FontAwesome name="star" size={24} color="#3AB4CC" />
        </View>
        <View style={styles.button}>
          <FontAwesome name="heart" size={24} color="#4FCC94" />
        </View>
        <View style={styles.button}>
          <Ionicons name="flash" size={24} color="#A65CD2" />
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  icons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    padding: 10,
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
