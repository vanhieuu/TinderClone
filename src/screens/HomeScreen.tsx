import {StyleSheet, View} from 'react-native';
import React from 'react';
import AnimatedStack from '../components/AnimatedStack';
import {data} from '../assets/data/users';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HomeScreen = () => {
  const onSwipeLeft = React.useCallback(data => {
    console.log('swipeLeft', data.name);
  }, []);
  const onSwipeRight = React.useCallback(data => {
    console.log('swipeRight', data.name);
  }, []);

  return (
    <View style={styles.pageContainer}>
      <AnimatedStack
        data={data}
        onSwipeLeft={onSwipeLeft}
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
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#ededed',
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
