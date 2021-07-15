import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.screen}>
            <Text>Home Screen !</Text>
            <Button 
                title="Go to Schedule" 
                onPress={()=> navigation.navigate('ScheduleList')} 
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

export default HomeScreen;