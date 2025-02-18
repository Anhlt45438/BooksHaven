/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import Add from './src/screens/AddProduct'
import {name as appName} from './app.json';
import 'react-native-gesture-handler';


AppRegistry.registerComponent(appName, () => Add);
