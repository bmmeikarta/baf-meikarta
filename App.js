import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Provider as AuthProvider } from './src/context/AuthContext';  
import { setNavigator } from './src/navigationRef';

import HomeScreen from "./src/screens/HomeScreen";
import ScheduleListScreen from "./src/screens/ScheduleListScreen";
import ScheduleDetailScreen from "./src/screens/ScheduleDetailScreen";
import ResolveScreen from "./src/screens/ResolveScreen";
import AccountScreen from "./src/screens/AccountScreen";
import SigninScreen from "./src/screens/SigninScreen";
import ResolveAuthScreen from './src/screens/ResolveAuthScreen';

const switchNavigator = createSwitchNavigator({
  ResolveAuth: ResolveAuthScreen,
  loginFlow: createStackNavigator({
    Signin: SigninScreen
  }),
  mainFlow: createBottomTabNavigator({
    Home: HomeScreen,
    scheduleFlow: createStackNavigator({
      ScheduleList: ScheduleListScreen,
      ScheduleDetail: ScheduleDetailScreen,
      Resolve: ResolveScreen
    }),
    Account: AccountScreen 
  })
});

const App = createAppContainer(switchNavigator);

export default () => {
  return <AuthProvider>
    <App 
      ref={(navigator) => { setNavigator(navigator) }} 
    />
  </AuthProvider>
}
