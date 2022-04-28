import 'react-native-gesture-handler';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import HomeScreen from './src/screens/HomeScreen';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MatchesScreen from './src/screens/MatchesScreen';
const color = '#b5b5b5';
const activeColor = '#F76C6B';
const App = () => {
  const [activeScreen, setActiveScreen] = React.useState<string>('HOME');

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.pageContainer}>
        <View style={styles.topNavigation}>
          <Pressable
            onPress={() => {
              setActiveScreen('HOME');

            }}>
            <Fontisto
              name="tinder"
              size={24}
              color={activeScreen === 'HOME' ? '#F76C6B' : color}
            />
          </Pressable>
          <Pressable>
            <MaterialCommunityIcons
              name="star-four-points"
              size={24}
              color={color}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              setActiveScreen('CHAT');
            }}>
            <Ionicons
              name="ios-chatbubbles"
              size={24}
              color={activeScreen === 'CHAT' ? '#F76C6B' : color}
            />
          </Pressable>
          <Pressable>
            <FontAwesome name="user" size={24} color={color} />
          </Pressable>
        </View>
        {activeScreen === 'HOME' && <HomeScreen />}
        {activeScreen === 'CHAT' && <MatchesScreen />}
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  root: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  topNavigation: {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
  },
});
