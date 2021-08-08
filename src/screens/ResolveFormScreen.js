import React, { useContext, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, Button } from "react-native-elements";
import RegularImagePicker from "../components/RegularImagePicker";
import { Context as ReportContext } from "../context/ReportContext";

const ResolveFormScreen = ({navigation}) => {
    const { addReportResolve } = useContext(ReportContext);
    const { idx, blocks, tower, category,  zone, qrcode, problem } = navigation.state.params;
    const [listResolve, setListResolve] = useState({
        idReport: null,
        photo: ''
    })
    
    const onTakingImage = (data) => {
        setListResolve(data);
    }

    const onSubmit = () => {
        addReportResolve(listResolve);
        navigation.navigate('Home');
    }

    return (<>
        <ScrollView style={styles.screen}>
            <View style={styles.containerHeader}>
                <Text style={styles.textBlockName}>{blocks}</Text>
                <View style={{flexDirection: 'row'}}>
                    <Text style={[styles.textBlockName, { backgroundColor: '#ffd485'}]}>{tower}</Text>
                    <Text style={[styles.textBlockName, { backgroundColor: '#3cc730'}]}>{`Zone ${zone}`}</Text>
                </View>
            </View>

            <View style={{backgroundColor: 'white', padding: 10, borderRadius: 5}}>
                <View style={styles.row}>
                    <View style={styles.containerLabel}><Text style={[styles.text]}>Position</Text></View>
                    <View><Text style={[styles.text]}>: {qrcode}</Text></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.containerLabel}><Text style={[styles.text]}>Category</Text></View>
                    <View><Text style={[styles.text]}>: {category}</Text></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.containerLabel}><Text style={[styles.text]}>Problem</Text></View>
                    <View><Text style={[styles.text]}>: {problem}</Text></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.containerLabel}><Text style={[styles.text]}>Photo After</Text></View>
                    <View><Text style={[styles.text]}>:</Text></View>
                </View>
            </View>
            <View style={{ alignSelf: 'center' }}>
                <RegularImagePicker idReport={idx} onTakingImage={onTakingImage} size={280}/>
            </View>
            <View style={{ marginTop: 20, marginBottom: 30 }}>
                <Button 
                    buttonStyle={styles.button}
                    title="Submit"
                    onPress={() => onSubmit()}
                />
            </View>
            
        </ScrollView>
    </>)
};

const styles = StyleSheet.create({
    screen: {
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    row: {
        flexDirection: 'row',
        marginVertical: 8
    },
    containerLabel: {
        width: '30%'
    },
    text: {
        fontWeight: 'bold',
        fontSize: 16
    },
    textStyle: {
        textAlign: 'center',
        fontWeight: 'bold'
    },
    textBlockName: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 22,
        marginBottom: 10,
        marginHorizontal: 10,
        padding: 5,
        borderRadius: 5
    },
    containerHeader: {
        alignSelf: 'center',
        marginBottom: 30
    },
    button: {
        width: "100%",
        height: 50,
        alignSelf: "center",
    },
});

export default ResolveFormScreen;