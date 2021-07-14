import React, { useState, useContext } from "react";
import { View, StyleSheet } from "react-native";
import {Text, Input, Button} from "react-native-elements";
import { Context as AuthContext } from '../context/AuthContext';

const SigninScreen = ({ navigation }) => {
    const { state, signin } = useContext(AuthContext);
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
            />
            <Input 
                secureTextEntry
                label="Password" 
                value={password} 
                onChangeText={setPassword} 
                autoCorrect={false}
            />
            <Button 
                title="Sign In"
                onPress={() => signin({ email, password })}
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