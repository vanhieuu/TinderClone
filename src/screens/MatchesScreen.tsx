import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';

import {Match, User} from '../models';
import {Auth, DataStore} from 'aws-amplify';

const MatchesScreen = ({isUserLoading}: {isUserLoading: boolean}) => {
  const [match, setMatch] = useState<Match[]>([]);
  const [me, setMe] = useState<User>();

  const getCurrentUser = async () => {
    const users = await Auth.currentAuthenticatedUser();
    const dbUsers = await DataStore.query(User, u =>
      u.sub('eq', users.attributes.sub),
    );
    if (!dbUsers || dbUsers.length === 0) {
      return;
    }
    getCurrentUser();
   
    
    setMe(dbUsers[0]);
  };

 

  useEffect(() => {
    if (isUserLoading || !me ||  match) {
      return;
    }
    const fetchMatches = async () => {
      const result = await DataStore.query(Match, m =>
        m
          .isMatch('eq', true)
          .or(m => m.User1ID('eq', me.id).User2ID('eq', me.id)),
      );

      setMatch(result);
    };
    fetchMatches();
  }, [me, isUserLoading]);

  useEffect(() => {
    const subscriptionFunc = async () => {
      const subscription = await DataStore.observe(Match).subscribe(msg => {
        if (msg.opType === 'UPDATE') {
          const newMatch = msg.element;
          if (
            newMatch.isMatch &&
            (newMatch.User1ID === me.id || newMatch.User2ID === me.id)
          ) {
            console.log('++++++++++++++++++++++++++');
          }
        }
      });
      return () => {
        subscription.unsubscribe();
      };
    };

    subscriptionFunc();
  }, [me]);
  console.log(match);
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={{fontWeight: 'bold', fontSize: 24, color: '#f63a6e'}}>
          New Matches
        </Text>
        <View style={styles.users}>
          {match.map(user => {
            const matchUsers =
              user.User1.id === me.id ? user.User2 : user.User1;
            return (
              <View key={user.User2.id} style={styles.user}>
                <Image source={{uri: matchUsers.image}} style={styles.image} />
                <Text style={styles.name}>{matchUsers.name}</Text>
                <Text style={styles.name}>{matchUsers.bio}</Text>
                <Text style={styles.name}>{matchUsers.gender}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MatchesScreen;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    padding: 10,
    flex: 1,
  },
  container: {
    padding: 10,
  },
  users: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  user: {
    width: 90,
    height: 90,
    margin: 10,
    borderWidth: 2,
    borderColor: '#f63a6e',
    borderRadius: 50,
    padding: 3,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  name: {
    textAlign: 'center',
    justifyContent: 'center',
    // position:'absolute',
    marginTop: 10,
    fontWeight: 'bold',
  },
});
