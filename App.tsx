import 'react-native-gesture-handler';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import HomeScreen from './src/screens/HomeScreen';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MatchesScreen from './src/screens/MatchesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import {DataStore, Hub} from 'aws-amplify';
import {User} from './src/models';
const color = '#b5b5b5';

const App = () => {
  const [activeScreen, setActiveScreen] = React.useState<string>('HOME');
  const [isUserLoading, setUserLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const listener = Hub.listen('datastore', async hubData => {
      const {event, data} = hubData.payload;
      if (event === 'modelSynced' && data?.model?.name === 'User') {
        console.log(`Modal has finished syncing `);
        setUserLoading(false);
      }
    });
    DataStore.query(User);
    return () => listener();
  }, []);

  const renderPage = () => {
    if (activeScreen === 'HOME') {
      return <HomeScreen isUserLoading={isUserLoading} />;
    }
    if (isUserLoading) {
      return (
        <ActivityIndicator size="large" color="#f76c6b" style={{flex: 1}} />
      );
    }
    if (activeScreen === 'CHAT') {
      return <MatchesScreen  isUserLoading={isUserLoading}  />;
    }
    if (activeScreen === 'PROFILE') {
      return <ProfileScreen />;
    }
  };

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
          <Pressable
            onPress={() => {
              setActiveScreen('PROFILE');
            }}>
            <FontAwesome
              name="user"
              size={24}
              color={activeScreen === 'PROFILE' ? '#F76C6B' : color}
            />
          </Pressable>
        </View>
        {/* {isUserLoading && <ActivityIndicator size='large' color='#f76c6b' style={{flex:1}}   />}

        {activeScreen === 'HOME' && <HomeScreen />}
        {activeScreen === 'CHAT' && <MatchesScreen />}
        {activeScreen === 'PROFILE' &&  !isUserLoading  &&  <ProfileScreen />} */}
        {renderPage()}
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
    width: '100%',
  },
  topNavigation: {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
  },
});
