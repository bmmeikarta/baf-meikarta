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
import _ from "lodash";

const HomeScreen = ({ navigation }) => {
    const { state: authState } = useContext(AuthContext);
    const { fetchSchedule, fetchSchedulePattern, getCurrentShift } = useContext(ScheduleContext);
    const { 
        state, 
        localToState, 
        fetchAsset, 
        fetchComplaint, 
        fetchLog,
        fetchPendingReport,
        fetchCategory,
        doPostReport, 
        doPostResolve 
    } = useContext(ReportContext);
    
    const { loading, lastUpdateDB, listAsset, testVal, listReportItem, listReportResolve, listComplaint } = state;
    const { userDetail } = authState;

    const countReportUpload = _.sum(listReportItem.map(v => v.listReportUpload.length));

    const countNotSync = listReportResolve.length + listReportItem.length;
    const countNotResolve = listComplaint.filter(v => v.status == 'REPORTED').length;

    const exampleData = [
        {
          "blocks": "51022",
          "created_at": "2021-08-16 06:54:45",
          "created_by": "121",
          "floor": "30",
          "listReportUpload": [
            {
              "category": "Kebersihan",
              "id_asset": null,
              "photo_before": "file:///storage/emulated/0/DCIM/36e0c499-b2a8-45a0-a716-0112ab18cf58.jpg",
              "problem": null,
              "qrcode": null,
              "sku_code": "1",
            },
            {
              "category": "Keamanan",
              "id_asset": "7856",
              "photo_before": "file:///storage/emulated/0/DCIM/912ab304-2b1b-4a38-9d84-24489e33f8f7.jpg",
              "problem": "Object Hilang / Pencurian",
              "qrcode": "BAF007379",
              "sku_code": "2.1.2",
            },
            {
              "category": "Keamanan",
              "id_asset": null,
              "photo_before": "file:///storage/emulated/0/DCIM/cf7d4417-9afd-4643-b832-0b3eeb133443.jpg",
              "problem": "Pelanggaran Ketertiban Penghuni",
              "qrcode": null,
              "sku_code": "2.3",
            },
          ],
          "shift_id": "1",
          "tower": "1B",
          "zone": 1,
        },
      ];
    
    const fetchLocalReportItem = async() => {
        // await AsyncStorage.setItem('localReportItem', JSON.stringify(exampleData));
        // await AsyncStorage.removeItem('localReportItem');
        // await AsyncStorage.removeItem('localResolvedReport');
        const local = await AsyncStorage.getItem('localReportItem');
        const localResolvedReport = await AsyncStorage.getItem('localResolvedReport');
        const serverLog = await AsyncStorage.getItem('serverLog');
        const serverComplaint = await AsyncStorage.getItem('serverComplaint');
        const serverPendingReport = await AsyncStorage.getItem('serverPendingReport');
        // navigation.setParams({ localReport: state.listReportItem, doPostReport: doPostReport });
        // console.log('HOME ', state.listReportItem);
        // console.log('LOCAL ', JSON.parse(local));
        // console.log('RESOLVED ', JSON.parse(localResolvedReport));
        // console.log('LOG ', JSON.parse(serverLog));
        // console.log('COMPLAINT ', JSON.parse(serverComplaint));
        // console.log('PENDING_REPORT ', JSON.parse(serverPendingReport));
    }

    const onSyncData = async () => {
        await NetInfo.fetch().then(async isConnected => {
            if (isConnected) {
                await fetchPendingReport();
                await fetchLog();
                await fetchComplaint();
                await fetchCategory();
                await fetchLocalReportItem();
                // await addReportItem(exampleData[0]);
                await fetchAsset();
                await fetchSchedule();
                await fetchSchedulePattern();
                await getCurrentShift();

                await localToState();
                await doPostReport();
                await doPostResolve();
            } else {
                Alert.alert("Oopss..", "Sorry you're offline now, please sync your data later");
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
                    {((userDetail || {}).data || {}).profile_id == 28 &&
                        <View style={styles.container}>
                            <Button 
                                buttonStyle={[styles.buttonChild, { backgroundColor: '#eb8015' }]}
                                title="CHECK-IN" 
                                onPress={()=> !loading ? navigation.navigate('CheckIn') : null} 
                            />
                        </View>
                    }
                    {((userDetail || {}).data || {}).profile_id != 28 &&
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
                        { countNotResolve > 0 &&
                            <Badge
                                value={countNotResolve}
                                status="error"
                                containerStyle={styles.badgeStyle} 
                            />
                        }
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
        width: '32%'
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