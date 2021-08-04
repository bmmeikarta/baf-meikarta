import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {Text, Button} from "react-native-elements";
import { NavigationEvents, SafeAreaView } from "react-navigation";
import { Context as ScheduleContext } from "../context/ScheduleContext";
import { Context as ReportContext } from "../context/ReportContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

const HomeScreen = ({ navigation }) => {
    const { fetchSchedule, fetchSchedulePattern, getCurrentShift } = useContext(ScheduleContext);
    const { state, localToState, getReportState, addReportItem, fetchAsset } = useContext(ReportContext);
    const { loading, lastUpdateDB, listAsset } = state;

    const exampleData = {
        "blocks": "51022",
        "floor": "1",
        "listReportScan": [
           {
            "blocks": "51022",
            "category": "Keamanan",
            "floor": "1",
            "item_name": "APAR",
            "problem": "Object Hilang / Pencurian",
            "scan_item": [
              "https://tesss",
              "https://tesss",
            ],
            "tower": "1B",
            "zone": 1,
          },
        ],
        "listReportUpload": [
            {
                "category": "Keamanan",
                "item_name": "APAR",
                "id_asset": 6404,
                "problem": "Object Hilang / Pencurian",
                "created_at": moment().format('YYYY-MM-DD HH:mm:ss'),
                "photo_before": "tess"
            },
        ],
        "tower": "1B",
        "zone": 1,
      };
    
    const fetchLocalReportItem = async() => {
        // await AsyncStorage.removeItem('localReportItem');
        const local = await AsyncStorage.getItem('localReportItem');

        console.log('HOME ', state.listReportItem);
        console.log('LOCAL ', local);
    }
    // console.log(listAsset.length);
    return (
    <>
        <NavigationEvents 
            onWillFocus={async() => {
                await localToState();
                // await addReportItem(exampleData);
                await fetchLocalReportItem();
                await fetchAsset();
                await fetchSchedule();
                await fetchSchedulePattern();
                await getCurrentShift();
            }}
        />
        {/* <SafeAreaView> */}
            <View>
                {loading && 
                    <Text style={styles.status}>updating db...</Text>
                }
                {!loading && 
                    <Text style={styles.status}>db last update: {lastUpdateDB}</Text>
                }
            </View>
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
        {/* </SafeAreaView> */}
        
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
    status:{
        textAlign: "right",
        fontSize: 11,
        padding: 6
    }
});

export default HomeScreen;