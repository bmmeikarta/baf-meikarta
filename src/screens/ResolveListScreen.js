import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Accordion from "../components/accordion/Accordion";

const ResolveListScreen = props => {
    return (
        <View style={styles.screen}>
            <Text>Resolve Screen !</Text>
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

export default ResolveListScreen;