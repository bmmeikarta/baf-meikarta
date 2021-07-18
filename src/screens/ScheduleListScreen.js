import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, ScrollView, SafeAreaView } from "react-native";
import moment from 'moment';
import { NavigationEvents } from "react-navigation";
import { Context as ScheduleContext } from '../context/ScheduleContext';
import { navigate } from "../navigationRef";

const ScheduleListScreen = ({ navigation }) => {
    const { state, fetchSchedule, fetchSchedulePattern, getCurrentShift } = useContext(ScheduleContext);
    const { master_unit, currentShift, schedulePattern } = state;

    const dataUnit = (master_unit || []);
    // if(Object.keys(currentShift).length == 0){
    //     return (<>
    //         <NavigationEvents onWillFocus={getCurrentShift} />
    //         <View style={styles.no_schedule}>
    //             <Text style={styles.textStyle}>Shift Anda Belum Dimulai</Text>
    //         </View>
    //     </>)
    // }

    return (
    <>
        <NavigationEvents onWillFocus={() => {
            fetchSchedulePattern();
            fetchSchedule();
            getCurrentShift();
        }} />
            <ScrollView style={styles.screen}>
                <Timer getCurrentShift={getCurrentShift}/>
                { dataUnit.length > 0 &&
                    <Text style={styles.textBlockName}>{dataUnit[0].block_name}</Text>
                }
                <View style={styles.header}>
                    <View style={[styles.items, { backgroundColor: 'orange' }]}><Text style={styles.textStyle}>1B</Text></View>
                    <View style={[styles.items, { backgroundColor: '#ff9cf5' }]}><Text style={styles.textStyle}>Zone 1</Text></View>
                    <View style={[styles.items, { backgroundColor: '#ff9cf5' }]}><Text style={styles.textStyle}>Zone 2</Text></View>
                    <View style={[styles.items, { backgroundColor: '#ff9cf5' }]}><Text style={styles.textStyle}>Zone 3</Text></View>
                    <View style={[styles.items, { backgroundColor: '#ff9cf5' }]}><Text style={styles.textStyle}>Zone 4</Text></View>
                </View>
                <View style={{ paddingBottom: 20 }}>
                    {
                        (dataUnit || []).map((datum, idx) => { // This will render a row for each data element.
                            const statusFloor = getStatusFloor(currentShift, schedulePattern, datum.blocks, idx);
                            return <RenderRow key={datum.floor} floor={datum.floor} statusFloor={statusFloor} />;
                        })
                    }
                </View>
                
            </ScrollView>
    </>
    )
};

const getStatusFloor = (currentShift, schedulePattern, blocks, idx) => {

    // untuk dapat jam ke berapa dr shift tsb, 
    // e.g. jam ke 1 dari shift
    const hourNow = moment().format('H');
    let jamKe = (hourNow - currentShift.start) + 1;

    // to handle shift 3
    if(currentShift.end < currentShift.start && hourNow < currentShift.start){
        jamKe = parseInt(hourNow) + 1;
    }

    const activeBlock = schedulePattern.find(v => v.block == blocks) || {};
    const blockPattern = activeBlock.patterns || [];
    const activeFloor = blockPattern['pattern_' + jamKe] || '';
    const activeIDX = activeFloor.split(',');

    let inactiveFloor = '';
    for(let i=1; i < jamKe; i++){
        const floors = blockPattern['pattern_' + i] || '';
        inactiveFloor += floors + ',';
    }
    const inactiveIDX = inactiveFloor.split(',');
    
    if(inactiveIDX.includes(idx.toString())) return 'inactive';
    if(activeIDX.includes(idx.toString())) return 'active';
    
    return 'future';

};

const RenderRow = ({ floor, statusFloor }) => {
    let bgFloor = '#ff9cf5';
    let bgZone = '#000';

    if(statusFloor == 'inactive'){
        bgFloor = '#85a687'; 
        bgZone = '#85a687';
    }else if(statusFloor == 'active'){
        bgFloor = '#19d425'; 
        bgZone = '#19d425';
    } 
        

    return (
        <View style={styles.trow}>
            <View style={[styles.items, { backgroundColor: `${bgFloor}` }]}><Text style={styles.textStyle}>{floor}</Text></View>
            <View style={[styles.items, { backgroundColor: `${bgZone}` }]}></View>
            <View style={[styles.items, { backgroundColor: `${bgZone}` }]}></View>
            <View style={[styles.items, { backgroundColor: `${bgZone}` }]}></View>
            <View style={[styles.items, { backgroundColor: `${bgZone}` }]}></View>
        </View>
    );
}


const Timer = ({getCurrentShift}) => {
    const [timeLeft, setTimeLeft] = useState('--:--');

    // console.log(state);

    useEffect(()=>{
        const intervalId = setInterval(() => {
            const hourNow = moment().format('hh:mm:ss');
            const hourTo = moment().add(1, 'hours').format('hh:00:00')
            const timeNow = moment('1995-11-17 ' + hourNow);
            const timeTo = moment('1995-11-17 ' + hourTo);

            const hourDiff = moment(timeTo.diff(timeNow)).format('mm:ss');
            if(hourDiff == '59:59') getCurrentShift();
            setTimeLeft(hourDiff);
        }, 1000);

        // clear interval on re-render to avoid memory leaks
        return () => clearInterval(intervalId);
    },[])

    return (
        <View style={styles.containerTimer}>
            <Text style={[styles.textTimer, { marginBottom: 5 }]}>Next Schedule in</Text>
            <View style={{ alignSelf: 'center', backgroundColor: '#2fc2b8', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5 }}>
                <Text style={styles.textTimer}>{timeLeft}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    no_schedule: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    screen: {
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    header: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        height: 30,
    },
    trow: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        height: 20,
        marginVertical: 5,
    },
    items: {
        width: '19.6%',
        justifyContent: 'center',
        borderRadius: 5
    },
    textStyle: {
        textAlign: 'center',
        fontWeight: 'bold'
    },
    textBlockName: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 22,
        marginBottom: 10
    },
    containerTimer: {
        marginBottom: 30
    },
    textTimer: { 
        textAlign: 'center', 
        fontWeight: 'bold', 
        fontSize: 16 
    }
});

export default ScheduleListScreen;