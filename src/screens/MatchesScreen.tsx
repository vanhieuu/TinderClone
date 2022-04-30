import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';

import {Match, User} from '../models';
import {Auth, DataStore} from 'aws-amplify';

const MatchesScreen = () => {
  const [match, setMatch] = useState<Match[]>([]);
  const [me, setMe] = useState(null);
  const getCurrentUser = async () => {
    const users = await Auth.currentAuthenticatedUser();
    const dbUsers = await DataStore.query(User, u => u.sub('eq',users.attributes.sub));

    if (dbUsers.length < 0) {
      return;
    }

    setMe(dbUsers[0]);
  };
  useEffect(() => {
    getCurrentUser();
  }, []);
  useEffect(() => {
    if (!me) return;
    const fetchMatches = async () => {
      const result = await DataStore.query(Match, m =>
        m
          .isMatch('eq', true)
          .or(m => m.User1ID('eq', me.id).User2ID('eq', me.id)),
      );
      setMatch(result);
    };
    fetchMatches();
  }, [me]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={{fontWeight: 'bold', fontSize: 24, color: '#f63a6e'}}>
          New Matches
        </Text>
        <View style={styles.users}>
          {match.find(el => el.isMatch === true) ? (
            match.map(user => (
              <View key={user.id} style={styles.user}>
                <Image source={{uri: user.User2.image}} style={styles.image} />
              </View>
            ))
          ) : (
            <View>
              <Text> Đi quẹt tiếp đi </Text>
            </View>
          )}
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
    flexDirection: 'row',
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
});
