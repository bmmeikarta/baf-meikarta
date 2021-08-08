import React, { useContext } from "react";
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Text } from "react-native-elements";
import { Context as ReportContext } from '../context/ReportContext';

const ResolveListTableScreen = ({ navigation }) => {
    const { state, getReportState, addReportItem } = useContext(ReportContext);
    const { currentReportZone, listComplaint  } = state;
    const rowComplaint = (listComplaint || []).filter(v => v.blocks == currentReportZone.blocks 
        && v.tower == currentReportZone.tower && v.floor == currentReportZone.floor 
        && v.zone == currentReportZone.zone
    ) || {};

    const header = [
        'Category',
        'Problem',
        'Item Name',
    ];

    const Header = () => {
        return (
            <View style={styles.header}>
                {header.map((title, key) => (
                    <View key={key} style={[styles.items, { backgroundColor: 'white' }]}><Text style={styles.textStyle}>{title}</Text></View>
                ))}
            </View>
        )
    }

    const Row = ({ idx, data }) => {
        const bgColor = idx % 2 == 0 ? '#c7e4ff':'#c7e4ff';
        const onHandleRow = () => {
            navigation.navigate('ResolveForm', data);
        }
        return (
            <View style={styles.trow}>
                <TouchableOpacity onPress={() => onHandleRow()} style={[styles.items, { backgroundColor: `${bgColor}` }]}><Text style={{fontSize: 14}}>{data.category}</Text></TouchableOpacity >
                <TouchableOpacity onPress={() => onHandleRow()} style={[styles.items, { backgroundColor: `${bgColor}` }]}><Text style={{fontSize: 14}}>{data.problem}</Text></TouchableOpacity >
                <TouchableOpacity onPress={() => onHandleRow()} style={[styles.items, { backgroundColor: `${bgColor}` }]}><Text style={{fontSize: 14}}>{data.item_name}</Text></TouchableOpacity >
            </View>
        )
    }

    return (<>
        <SafeAreaView>
            <ScrollView style={styles.screen}>
                <Header />
                <View style={{paddingBottom: 20}}>
                    {rowComplaint.map((data, key) => (
                        <Row key={key} idx={key} data={data} />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    </>
    )
};

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
        height: 40,
    },
    trow: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        minHeight: 30,
        marginVertical: 5,
    },
    items: {
        width: '33%',
        justifyContent: 'center',
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 5,
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

export default ResolveListTableScreen;