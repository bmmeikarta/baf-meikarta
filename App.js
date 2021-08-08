import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Provider as AuthProvider } from './src/context/AuthContext'; 
import { Provider as ScheduleProvider } from './src/context/ScheduleContext';
import { Provider as ReportProvider } from './src/context/ReportContext';
import { setNavigator } from './src/navigationRef';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from "./src/screens/HomeScreen";
import ReportListScreen from "./src/screens/ReportListScreen";
import ReportZoneScreen from "./src/screens/ReportZoneScreen";
import ReportDetailScreen from "./src/screens/ReportDetailScreen";
import ScheduleListScreen from "./src/screens/ScheduleListScreen";
import ScheduleDetailScreen from "./src/screens/ScheduleDetailScreen";
import ResolveListScreen from "./src/screens/ResolveListScreen";
import AccountScreen from "./src/screens/AccountScreen";
import SigninScreen from "./src/screens/SigninScreen";
import ResolveAuthScreen from './src/screens/ResolveAuthScreen';
import { StyleSheet, Text } from 'react-native';
import ScannerScreen from './src/screens/ScannerScreen';
import ScannerScreenZone from './src/screens/ScannerScreenZone';
import ResolveListTableScreen from './src/screens/ResolveListTableScreen';
import ResolveFormScreen from './src/screens/ResolveFormScreen';

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});

const switchNavigator = createSwitchNavigator({
  ResolveAuth: ResolveAuthScreen,
  loginFlow: createStackNavigator({
    Signin: SigninScreen
  }),
  mainFlow: createBottomTabNavigator({
    // TAB HOME
    homeFlow: {
      screen: createStackNavigator({
        Home: HomeScreen,
      }),
      navigationOptions: {
        tabBarLabel: ()=>null,
        tabBarIcon: (tabInfo) => {
          return <Ionicons name="ios-apps" size={28} color={tabInfo.tintColor}></Ionicons>
        },
      }
    },
    // TAB SCHEDULE
    scheduleFlow: { 
      screen: createStackNavigator({
        ScheduleList: {
          screen: ScheduleListScreen,
          navigationOptions: {
            headerTitle: ()=><Text style={styles.headerTitle}>{'Schedule'}</Text>,
          }
        },
        ScheduleReportDetail: {
          screen: ReportDetailScreen,
          navigationOptions: {
            headerTitle: ()=><Text style={styles.headerTitle}>{'Complaint Detail'}</Text>,
          }
        },
      }),
      navigationOptions: {
        tabBarLabel: ()=>null,
        tabBarIcon: (tabInfo) => {
          return <Ionicons name="ios-time-outline" size={30} color={tabInfo.tintColor}></Ionicons>
        }
      }
    },
    // TAB REPORT
    reportFlow: {
      screen: createStackNavigator({
        ReportList: {
          screen: ReportListScreen,
          navigationOptions: {
            headerTitle: ()=><Text style={styles.headerTitle}>{'Complaint'}</Text>,
          }
        },
        ReportZone: {
          screen: ReportZoneScreen,
          navigationOptions: {
            headerTitle: ()=><Text style={styles.headerTitle}>{'Choose Zone'}</Text>,
          }
        },
        ReportScannerZone: {
          screen: ScannerScreenZone,
          navigationOptions: {
            headerTitle: ()=><Text style={styles.headerTitle}>{'Checking Zone'}</Text>,
          }
        },
        ReportDetail: {
          screen: ReportDetailScreen,
          navigationOptions: {
            headerTitle: ()=><Text style={styles.headerTitle}>{'Complaint Detail'}</Text>,
          }
        },
        ReportScanner: {
          screen: ScannerScreen,
          navigationOptions: {
            headerTitle: ()=><Text style={styles.headerTitle}>{'Asset Reading'}</Text>,
          }
        },
      }),
      navigationOptions: {
        tabBarLabel: ()=>null,
        tabBarIcon: (tabInfo) => {
          return <Ionicons name="ios-document-attach-outline" size={30} color={tabInfo.tintColor}></Ionicons>
        }
      }
    },
    // TAB RESOLVE
    resolveFlow: {
      screen: createStackNavigator({
        ResolveList: {
          screen: ResolveListScreen,
          navigationOptions: {
            headerTitle: ()=><Text style={styles.headerTitle}>{'Resolve'}</Text>,
          }
        },
        ResolveZone: {
          screen: ReportZoneScreen,
          navigationOptions: {
            headerTitle: ()=><Text style={styles.headerTitle}>{'Choose Zone'}</Text>,
          }
        },
        ResolveScannerZone: {
          screen: ScannerScreenZone,
          navigationOptions: {
            headerTitle: ()=><Text style={styles.headerTitle}>{'Checking Zone'}</Text>,
          }
        },
        ResolveListTable: {
          screen: ResolveListTableScreen,
          navigationOptions: {
            headerTitle: ()=><Text style={styles.headerTitle}>{'List Complaint'}</Text>,
          }
        },
        ResolveForm: {
          screen: ResolveFormScreen,
          navigationOptions: {
            headerTitle: ()=><Text style={styles.headerTitle}>{'Resolve Complaint'}</Text>,
          }
        },
      }),
      navigationOptions: {
        tabBarLabel: ()=>null,
        tabBarIcon: (tabInfo) => {
          return <Ionicons name="ios-reload-circle-outline" size={32} color={tabInfo.tintColor}></Ionicons>
        }
      }
    },
    // TAB ACCOUNT
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
  return (
    <AuthProvider>
      <ScheduleProvider>
        <ReportProvider>
          <App 
            ref={(navigator) => { setNavigator(navigator) }} 
          />
        </ReportProvider>
      </ScheduleProvider>
    </AuthProvider>
  )
}
