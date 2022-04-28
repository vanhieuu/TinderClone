import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import { data } from '../assets/data/users';

const MatchesScreen = () => {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={{fontWeight: 'bold', fontSize: 24, color: '#f63a6e'}}>
          New Matches
        </Text>
        <View style={styles.users}>
        {data.map((user) =>(
            <View key={user.id} style={styles.user} >
                <Image
                source={{uri:user.image}}
                style={styles.image}
                />
            </View>
        ))}
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
  container:{
        padding:10
  },
  users:{
      flexDirection:'row',
      flexWrap:'wrap',
      
  },
  user:{
      width:90,
      height:90,
      flexDirection:'row',
      margin:10,
      borderWidth:2,
      borderColor:'#f63a6e',
      borderRadius:50,
      padding:3
  },
  image:{
    width:'100%',
    height:'100%',
    borderRadius:50
  }
});
