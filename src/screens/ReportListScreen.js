import React, { useContext } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Button } from "react-native-elements";
import { Timer } from "./ScheduleListScreen";
import { NavigationEvents } from "react-navigation";
import { Context as ScheduleContext } from '../context/ScheduleContext';

const ReportListScreen = ({ navigation }) => {
  const { state, fetchSchedule, fetchSchedulePattern, getCurrentShift, getActiveFloor } = useContext(ScheduleContext);
  const { master_unit, activeFloor, currentShift, schedulePattern } = state;
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
        { dataUnit.length > 0 &&
            <Text style={styles.textBlockName}>{dataUnit[0].block_name} - {dataUnit[0].tower}</Text>
        }
        <View style={styles.row}>

          {dataUnit.map((v, key) => {

            const isActive = activeFloor.includes(v.floor);

            return <View key={key} style={styles.container}>
              <Button 
                buttonStyle={{ backgroundColor: `${isActive ? '#6598eb': '#000'}` }}
                onPress={() => isActive ? navigation.navigate('ReportZone', { ...v }) : null}
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