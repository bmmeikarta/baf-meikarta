import React, { useContext } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { Context as ReportContext } from '../context/ReportContext';

const ReportZoneScreen = ({ navigation }) => {
    const { state, setCurrentZone } = useContext(ReportContext);
    const { block_name, blocks, tower, floor } = navigation.state.params;
    const { currentReportZone } =  state;

    const onChooseZone = async (zone) => {
        const floorName = block_name + ' - ' + tower + ' - ' + floor + ' - Zone ' + zone;
        await setCurrentZone({blocks, tower, floor, zone});
        navigation.navigate('ReportDetail', { headerTitle: `${floorName}` })
    };
    const checkZoneStored = () => {};

    return (
        <View style={styles.screen}>
            <Text style={styles.textBlockName}>{block_name} - {tower} - {floor}</Text>
            <View style={styles.zoneOption}>
                <TouchableOpacity onPress={() => onChooseZone(3)} style={{ width: 50, height: 80 }}>
                    <View style={{ width: 50, height: 80, justifyContent: 'center' }}>
                        <Svg width="50" height="80">
                            <Rect
                                x="0"
                                y="0"
                                width="50"
                                height="80"
                                fill={checkZoneStored(3) ? "grey" : "blue"}
                            />
                        </Svg>
                        <Text style={{ position: 'absolute', left: 3, color: checkZoneStored(3) ? 'white' : '#fff' }}>Zone 3</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: 170, height: 50 }} onPress={() => onChooseZone(2)}>
                    <View style={{ width: 170, height: 50, justifyContent: 'center' }}>
                        <Svg width="170" height="50">
                            <Rect
                                x="0"
                                y="0"
                                width="170"
                                height="50"
                                fill={checkZoneStored(2) ? "grey" : "#ffcea1"}
                            />
                        </Svg>
                        <Text style={{ position: 'absolute', left: '50%', color: checkZoneStored(2) ? 'white' : '#000' }}>Zone 2</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: 50, height: 80 }} onPress={() => onChooseZone(4)}>
                    <View style={{ width: 50, height: 80, justifyContent: 'center' }}>
                        <Svg width="50" height="80">
                            <Rect
                                x="0"
                                y="0"
                                width="50"
                                height="80"
                                fill={checkZoneStored(4) ? "grey" : "green"}
                            />
                            <Text style={{ position: 'absolute', color: checkZoneStored(4) ? 'white' : '#fff', top: 30, left: 3 }}>Zone 4</Text>
                        </Svg>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ left: 169, bottom: 170, width: 50, height: 120 }} onPress={() => onChooseZone(1)}>
                    <View style={{ width: 50, height: 120, justifyContent: 'center' }}>
                        <Svg width="50" height="120">
                            <Rect
                                x="0"
                                y="0"
                                width="50"
                                height="120"
                                fill={checkZoneStored(1) ? "grey" : "orange"}
                            />
                        </Svg>
                        <Text style={{ position: 'absolute', color: 'white', left: 3 }}>
                            Zone 1
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
      paddingVertical: 20,
      paddingHorizontal: 10,
    },
    zoneOption:{
        alignSelf: 'center',
        justifyContent: 'center',
        height: '90%'
    },
    textBlockName: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 22,
      marginBottom: 10
    },
  })

export default ReportZoneScreen;