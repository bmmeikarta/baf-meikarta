import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {Text, Button} from "react-native-elements";
import { NavigationEvents, SafeAreaView } from "react-navigation";
import { Context as ScheduleContext } from "../context/ScheduleContext";
import { Context as ReportContext } from "../context/ReportContext";

const HomeScreen = ({ navigation }) => {
    const { fetchSchedule, fetchSchedulePattern, getCurrentShift } = useContext(ScheduleContext);
    const { state, localToState, getReportState } = useContext(ReportContext);

    console.log('HOME ', state.listReportItem);

    return (
    <>
        <NavigationEvents 
            onWillFocus={async() => {
                // await localToState();
                await fetchSchedule();
                await fetchSchedulePattern();
                await getCurrentShift();
            }}
        />
        <SafeAreaView style={styles.screen}>
            <Button 
                buttonStyle={styles.button}
                title="SCHEDULE SEC / CSO / ENG" 
                onPress={()=> navigation.navigate('ScheduleList')} 
            />
            <View style={styles.row}>
                <View style={styles.container}>
                    <Button 
                        buttonStyle={[styles.buttonChild, { backgroundColor: '#eb8015' }]}
                        title="COMPLAINT" 
                        onPress={()=> navigation.navigate('ReportList')} 
                    />
                </View>
                <View style={styles.container}>
                    <Button 
                        buttonStyle={[styles.buttonChild, { backgroundColor: '#0fbd32' }]}
                        title="RESOLVE" 
                        onPress={()=> navigation.navigate('ResolveList')} 
                    />
                </View>
                <View style={styles.container}>
                    <Button 
                        buttonStyle={[styles.buttonChild, { backgroundColor: '#bd0f0f' }]}
                        title="EMERGENCY" 
                        onPress={()=> navigation.navigate('ReportList')} 
                    />
                </View>
            </View>
        </SafeAreaView>
    </>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        marginBottom: 100,
        paddingVertical: 20,
        paddingHorizontal: 10
    },
    button: {
        width: "100%",
        height: 50,
        alignSelf: "center",
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingVertical: 10
    },
    container: {
        width: '33%'
    },
    buttonChild: {
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 4,
        height: 80,
    },
});

export default HomeScreen;