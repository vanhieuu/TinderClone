import {ImageBackground, StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {UserTypeProps} from '../../assets/data/users';
import { User } from '../../models';

interface CardProps extends UserTypeProps {
  items: User;
}

const TinderCard = ({items}: CardProps) => {
  return (
    <View style={styles.card}>
      <ImageBackground source={{uri: items.image}} style={styles.image}>
        <View style={styles.cardInner}>
          <Text style={styles.name}>{items.name}</Text>
          <Text style={styles.bio}>{items.bio}</Text>
          <Text style={styles.bio}>{items.gender === 'MALE' ? 'Nam' : 'Nữ'}</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

export default TinderCard;

const styles = StyleSheet.create({
  card: {
   width:'90%',
   height:'85%',
    backgroundColor: 'blue',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
    flex:1,
    
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },

  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#f5f5f5',
    marginHorizontal: 10,
  },
  bio: {
    fontSize: 18,
    lineHeight: 25,
    color: '#f5f5f5',
    marginHorizontal: 10,
  },
  cardInner: {
    padding: 10,
  },
});
