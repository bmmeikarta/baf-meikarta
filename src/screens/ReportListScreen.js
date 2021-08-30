import React, { useContext, useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Button } from "react-native-elements";
import { Timer, getStatusFloor } from "./ScheduleListScreen";
import { NavigationEvents } from "react-navigation";
import { Context as ScheduleContext } from '../context/ScheduleContext';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as ReportContext } from '../context/ReportContext';
import _ from "lodash";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ReportListScreen = ({ navigation }) => {
  const { state: authState } = useContext(AuthContext);
  const { state: reportState, resetReportScan } = useContext(ReportContext);
  const { state, fetchSchedule, fetchSchedulePattern, getCurrentShift, getActiveFloor } = useContext(ScheduleContext);
  const { master_unit, activeFloor, currentShift, schedulePattern } = state;
  const { userDetail } = authState;

  const uniqTower = _.uniq(_.map(master_unit, 'tower')) || [];
  const defaultTower = uniqTower[0] || '';
  const [activeTower, setActiveTower] = useState(defaultTower);
  const dataUnit = (master_unit || []).filter(v => v.tower == activeTower);

  return (
    <>
      <NavigationEvents 
        onWillFocus={async() => {
          const serverSchedule = JSON.parse(await AsyncStorage.getItem('serverSchedule')) || [];
          const serverSchedulePattern = JSON.parse(await AsyncStorage.getItem('serverSchedulePattern')) || [];
          if(serverSchedule.length == 0) Alert.alert('Info', 'No schedule, please try to sync');
          await getCurrentShift();
          setActiveTower(defaultTower);
        }}
      />
      <ScrollView style={styles.screen}>
        <Timer getCurrentShift={getCurrentShift}></Timer>
        { dataUnit.length == 0 &&
            <Text style={styles.textBlockName}>No Schedule</Text>
        }
        { dataUnit.length > 0 &&
            <Text style={styles.textBlockName}>{dataUnit[0].blocks} - {dataUnit[0].tower}</Text>
        }
        <View style={{ marginBottom: 20, flexDirection: 'row', justifyContent: "center", }}>
            {
                uniqTower.map(tower => {
                    let bgFilter = 'white';
                    if(tower == activeTower) bgFilter = 'orange'; 
                    if(tower) return <TouchableOpacity key={tower} onPress={() => setActiveTower(tower)} style={[styles.filterTower, { backgroundColor: `${bgFilter}`}]}><Text style={styles.textTimer}>{tower}</Text></TouchableOpacity >
                })
            }
        </View>
        <View style={styles.row}>

          {dataUnit.map((v, key) => {

            const statusFloor = getStatusFloor(v.blocks, v.floor, v.tower);
            let bgFloor = '#000';
            if(statusFloor == 'active') bgFloor = '#6598eb';
            if(statusFloor == 'on progress') bgFloor = '#dfe305';
            if(statusFloor == 'done') bgFloor = '#41db30';

            const canAccess = statusFloor == 'active' || statusFloor == 'on progress';
            
            return <View key={key} style={styles.container}>
              <Button 
                buttonStyle={{ backgroundColor: `${bgFloor}` }}
                onPress={() => canAccess ? navigation.navigate('ReportZone', { ...v, parentScreen: 'Report' }) : null}
                title={v.floor}
              />
            </View>
          })}

        </View>
      </ScrollView>
      {/* <ScheduleListScreen 
        navigation={navigation} 
        parentComponent={'ReportList'} 
        showActiveOnly={true} 
      /> */}
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingVertical: 10
  },
  button: {
    height: 50,
    alignSelf: "center",
  },
  container: {
    width: '33%',
    padding: 2
  },
  textBlockName: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 10
  },
  textTimer: { 
    textAlign: 'center', 
    fontWeight: 'bold', 
    fontSize: 16 
},
  timer: { alignSelf: 'center', backgroundColor: '#2fc2b8', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5 },
  filterTower: {
      backgroundColor: 'white',
      borderColor: 'orange',
      borderWidth: 1,
      alignSelf: 'center', 
      paddingVertical: 5, 
      paddingHorizontal: 10, 
      borderRadius: 5,
      width: 70,
      marginHorizontal: 5
  }
})

export default ReportListScreen;