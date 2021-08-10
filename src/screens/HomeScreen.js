import React, { useContext, useEffect, useLayoutEffect } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import {Text, Button, Badge} from "react-native-elements";
import { NavigationEvents, SafeAreaView } from "react-navigation";
import { Context as ScheduleContext } from "../context/ScheduleContext";
import { Context as ReportContext } from "../context/ReportContext";
import { Context as AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";

const HomeScreen = ({ navigation }) => {
    const { state: authState } = useContext(AuthContext);
    const { fetchSchedule, fetchSchedulePattern, getCurrentShift } = useContext(ScheduleContext);
    const { state, localToState, getReportState, addReportItem, fetchAsset, fetchComplaint, doPostReport, doPostResolve } = useContext(ReportContext);
    
    const { loading, lastUpdateDB, listAsset, testVal, listReportItem, listReportResolve } = state;
    const { userDetail } = authState;

    const countNotSync = listReportResolve.length + listReportItem.length;
    const exampleData = [{
        "blocks": "51022",
        "floor": "27",
        "listReportUpload": [
         {
            "category": "Kebersihan",
            "id_asset": null,
            "photo_before": "file:///storage/emulated/0/DCIM/5638efa4-cfa1-4d2f-a13e-a587751243e7.jpg",
            "problem": null,
            "qrcode": null,
          },
        ],
        "tower": "1B",
        "zone": 1,
      },
        {
        "blocks": "51022",
        "floor": "27",
        "listReportUpload": [
          {
            "category": "Keamanan",
            "id_asset": null,
            "photo_before": "file:///storage/emulated/0/DCIM/cfedea29-e4b7-480b-afbd-dff7899fe8bc.jpg",
            "problem": "Pengerusakan Assets / Grafiti",
            "qrcode": null,
          },
        ],
        "tower": "1B",
        "zone": 2,
      }];
    
    const fetchLocalReportItem = async() => {
        // await AsyncStorage.removeItem('localReportItem');
        const local = await AsyncStorage.getItem('localReportItem');
        const localResolvedReport = await AsyncStorage.getItem('localResolvedReport');
        // navigation.setParams({ localReport: state.listReportItem, doPostReport: doPostReport });
        // console.log('HOME ', state.listReportItem);
        console.log('LOCAL ', JSON.parse(local));
        console.log('RESOLVED ', JSON.parse(localResolvedReport));
    }

    const onSyncData = async () => {
        await NetInfo.fetch().then(async isConnected => {
            if (isConnected) {
                await doPostReport();
                await doPostResolve();
                await fetchComplaint();
                await localToState();
                await fetchLocalReportItem();
                // await addReportItem(exampleData[0]);
                await fetchAsset();
                await fetchSchedule();
                await fetchSchedulePattern();
                await getCurrentShift();
            } else {
                Alert.alert("Oopss..", "Sorry you're offline");
            }
        });
        
    };
    // console.log(listAsset.length);
    return (
    <>
        <NavigationEvents 
            onWillFocus={async() => {
                await onSyncData();
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
                <View style={styles.headerButton}>
                    
                    <Button
                        buttonStyle={{ width: 90, alignSelf: "flex-end", backgroundColor: "purple"}}
                        onPress={() => !loading ? onSyncData() : null}
                        title="Sync"
                        color="#fff"
                        icon={
                            <Ionicons
                                style={{ marginRight: 5}}
                                name="ios-sync"
                                size={16}
                                color="white"
                            />
                        }
                        iconPosition="left"
                        loading={loading}
                    />
                    { countNotSync > 0 &&
                        <Badge
                            value={countNotSync}
                            status="error"
                            containerStyle={styles.badgeStyle} 
                        />
                    }
                </View>
            </View>
            <SafeAreaView style={styles.screen}>
                <Button 
                    buttonStyle={styles.button}
                    title="SCHEDULE SEC / CSO / ENG" 
                    onPress={()=> !loading ? navigation.navigate('ScheduleList') : null} 
                />
                <View style={styles.row}>
                    {userDetail.profile_id == 100 &&
                        <View style={styles.container}>
                            <Button 
                                buttonStyle={[styles.buttonChild, { backgroundColor: '#eb8015' }]}
                                title="CHECK-IN" 
                                onPress={()=> !loading ? navigation.navigate('CheckIn') : null} 
                            />
                        </View>
                    }
                    {userDetail.profile_id != 100 &&
                        <View style={styles.container}>
                            <Button 
                                buttonStyle={[styles.buttonChild, { backgroundColor: '#eb8015' }]}
                                title="COMPLAINT" 
                                onPress={()=> !loading ? navigation.navigate('ReportList') : null} 
                            />
                        </View>
                    }
                    <View style={styles.container}>
                        <Button 
                            buttonStyle={[styles.buttonChild, { backgroundColor: '#0fbd32' }]}
                            title="RESOLVE" 
                            onPress={()=> !loading ? navigation.navigate('ResolveList') : null} 
                        />
                    </View>
                    <View style={styles.container}>
                        <Button 
                            buttonStyle={[styles.buttonChild, { backgroundColor: '#bd0f0f' }]}
                            title="EMERGENCY" 
                            onPress={()=> !loading ? navigation.navigate('ReportList') : null} 
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
    },
    headerButton: {
        marginHorizontal: 8,
        marginTop: 8
    },
    badgeStyle: {
        position: 'absolute',
        top: -4,
        right: -4,
    },
});

HomeScreen.navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    const { params } = state;
    const { localReport, doPostReport } = params || {};

    const onSyncData = async () => {
        await doPostReport();
        // navigation.setParams({ localReport: [] });
    }
    return ({
        headerRight: () => (<View style={styles.headerButton}>
            {/* <Button
                onPress={() => onSyncData()}
                title="Sync Data"
                color="#fff"
            />
            { (localReport || []).length > 0 &&
                <Badge
                    value={localReport.length}
                    status="error"
                    containerStyle={styles.badgeStyle} 
                />
            } */}
        </View>
        ),
    })
}
export default HomeScreen;