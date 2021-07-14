import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const ScheduleListScreen = ({ navigation }) => {
    return (
        <View style={styles.screen}>
            <Text>Schedule List Screen !</Text>
            <Button 
                title="Go to Detail Schedule" 
                onPress={()=> navigation.navigate('ScheduleDetail')} 
            />
        </View>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default ScheduleListScreen;