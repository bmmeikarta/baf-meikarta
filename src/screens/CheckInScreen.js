import React, { useContext, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Button } from "react-native-elements";
import { Timer, getStatusFloor } from "./ScheduleListScreen";
import { NavigationEvents } from "react-navigation";
import { Context as ScheduleContext } from '../context/ScheduleContext';
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CheckInScreen = ({ navigation }) => {
  const { getCurrentShift } = useContext(ScheduleContext);
  const [listCheckIn, setListCheckIn] = useState([]);

  const localToState = async () => {
    const localCheckIn = JSON.parse(await AsyncStorage.getItem('localCheckIn')) || [];
    setListCheckIn(localCheckIn);
  }
  // console.log('REPORT LIST ', reportState);
  return (
    <>
      <NavigationEvents 
        onWillFocus={async() => {
          await getCurrentShift();
          await localToState();
        }}
      />
      <ScrollView style={styles.screen}>
        <Timer label={`Next Check-In`} getCurrentShift={getCurrentShift}></Timer>
        <View style={styles.row}>

          {[1,2,3,4,5,6,7,8,9].map((zone, key) => {
            let bgFloor = '#000';
            const canAccess = true;
            const isChecked = listCheckIn.find(c => c.zone == zone && moment(c.created_at).format('YYYY-MM-DD HH') == moment().format('YYYY-MM-DD HH'));
            if(canAccess) bgFloor = '#6598eb';
            if(isChecked) bgFloor = '#23db1d';

            return <View key={key} style={styles.container}>
              <Button 
                buttonStyle={{ backgroundColor: `${bgFloor}` }}
                onPress={() => canAccess ? navigation.navigate('CheckInScanner', { zone }) : null}
                title={zone}
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

export default CheckInScreen;