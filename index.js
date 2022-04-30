/**
 * @format
 */
 import 'react-native-gesture-handler';
 import '@azure/core-asynciterator-polyfill'
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Amplify } from 'aws-amplify'
import awsconfig from './src/aws-exports'
import { withAuthenticator } from 'aws-amplify-react-native/dist/Auth';
Amplify.configure({
    ...awsconfig,
    Analytics: {
        disabled: true,
      },
})
AppRegistry.registerComponent(appName, () => withAuthenticator(App));
