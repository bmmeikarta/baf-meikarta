import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import ScheduleListScreen from "./ScheduleListScreen";

const ReportListScreen = ({ navigation }) => {
  return (
    <>
      <ScheduleListScreen 
        navigation={navigation} 
        parentComponent={'ReportList'} 
        showActiveOnly={true} 
      />
    </>
  );
};

export default ReportListScreen;