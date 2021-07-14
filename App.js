import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Provider as AuthProvider } from './src/context/AuthContext';  

import HomeScreen from "./src/screens/HomeScreen";
import ScheduleListScreen from "./src/screens/ScheduleListScreen";
import ScheduleDetailScreen from "./src/screens/ScheduleDetailScreen";
import ResolveScreen from "./src/screens/ResolveScreen";
import AccountScreen from "./src/screens/AccountScreen";
import SigninScreen from "./src/screens/SigninScreen";

const switchNavigator = createSwitchNavigator({
  loginFlow: createStackNavigator({
    Signin: SigninScreen
  }),
  mainFlow: createBottomTabNavigator({
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
    <App></App>
  </AuthProvider>
}
