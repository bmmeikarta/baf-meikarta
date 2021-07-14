import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {Text, Input, Button} from "react-native-elements";

const SigninScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={styles.screen}>
            <Text h3>Sign In BAF</Text>
            <Input 
                label="Email" 
                value={email} 
                onChangeText={setEmail}
                autoCorrect={false}
                autoCapitalize={false} 
            />
            <Input 
                secureTextEntry
                label="Password" 
                value={password} 
                onChangeText={setPassword} 
                autoCorrect={false}
                autoCapitalize={false}
            />
            <Button 
                title="Sign In"
                onPress={() => navigation.navigate("ScheduleList")}
            />
        </View>
    )
};

SigninScreen.navigationOptions = () => {
    return {
      headerShown: false,
    };
  };

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 100
    }
});

export default SigninScreen;