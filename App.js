import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Provider as AuthProvider } from './src/context/AuthContext';  
import { setNavigator } from './src/navigationRef';
import { Ionicons } from '@expo/vector-icons';

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
    Home: { 
      screen: HomeScreen,
      navigationOptions: {
        tabBarLabel: ()=>null,
        tabBarIcon: (tabInfo) => {
          return <Ionicons name="ios-home" size={28} color={tabInfo.tintColor}></Ionicons>
        }
      }
    },
    scheduleFlow: { 
        screen: createStackNavigator({
          ScheduleList: ScheduleListScreen,
          ScheduleDetail: ScheduleDetailScreen,
          Resolve: ResolveScreen
        }),
        navigationOptions: {
          tabBarLabel: ()=>null,
          tabBarIcon: (tabInfo) => {
            return <Ionicons name="ios-time" size={30} color={tabInfo.tintColor}></Ionicons>
          }
        }
      },
    Account: { 
      screen: AccountScreen,
      navigationOptions: {
        tabBarLabel: ()=>null,
        tabBarIcon: (tabInfo) => {
          return <Ionicons name="ios-person" size={30} color={tabInfo.tintColor}></Ionicons>
        }
      }
    } 
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
