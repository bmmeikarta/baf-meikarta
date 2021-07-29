import React, { useContext } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Button } from "react-native-elements";
import { Timer, getStatusFloor } from "./ScheduleListScreen";
import { NavigationEvents } from "react-navigation";
import { Context as ScheduleContext } from '../context/ScheduleContext';
import { Context as AuthContext } from '../context/AuthContext';

const ReportListScreen = ({ navigation }) => {
  const { state: authState } = useContext(AuthContext);
  const { state, fetchSchedule, fetchSchedulePattern, getCurrentShift, getActiveFloor } = useContext(ScheduleContext);
  const { master_unit, activeFloor, currentShift, schedulePattern } = state;
  const { userDetail } = authState;
  const dataUnit = (master_unit || []);

  return (
    <>
      <NavigationEvents 
        onWillFocus={async() => {
          await fetchSchedule();
          await fetchSchedulePattern();
          await getCurrentShift();
          await getActiveFloor(currentShift, schedulePattern, '51022');
        }}
      />
      <ScrollView style={styles.screen}>
        <Timer getCurrentShift={getCurrentShift}></Timer>
        { dataUnit.length == 0 &&
            <Text style={styles.textBlockName}>loading..</Text>
        }
        { dataUnit.length > 0 &&
            <Text style={styles.textBlockName}>{dataUnit[0].block_name} - {dataUnit[0].tower}</Text>
        }
        <View style={styles.row}>

          {dataUnit.map((v, key) => {

            const statusFloor = getStatusFloor(userDetail, currentShift, schedulePattern, v.blocks, v.floor);

            let bgZone = '#000';
            if(statusFloor == 'inactive'){
                bgZone = '#ffd35c';
            }else if(statusFloor == 'active'){
                bgZone = '#6598eb';
            }

            return <View key={key} style={styles.container}>
              <Button 
                buttonStyle={{ backgroundColor: `${bgZone}` }}
                onPress={() => statusFloor == 'active' ? navigation.navigate('ReportZone', { ...v }) : null}
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
})

export default ReportListScreen;