import React, { useState } from "react";
import { Image, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Text } from "react-native-elements";
import Animated from "react-native-reanimated";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const ContainerImagePicker = ({ header }) => {
    const [pickedImage, setPickedImage] = useState();
    const takeImageHandler = async () => {
      const image = await ImagePicker.launchCameraAsync({
          aspect: [16, 9],
          quality: 0.5
      });
      setPickedImage(image.uri);
    };
    console.log(pickedImage);
    return (<>
          {header && 
            <Text style={styles.header}>{header || ''}</Text>
          }
          <Animated.View style={[styles.detail]}>
              
              <View style={styles.detailCol}>
                  <Text>{'Foto'}</Text>
                  {pickedImage &&
                    <View style={styles.imagePicker}>
                        <Image style={{ width: 70, height: 70 }} source={{ uri: pickedImage }}></Image>
                    </View>
                  }
                  {!pickedImage &&
                    <TouchableWithoutFeedback onPress={takeImageHandler}>
                        <View style={styles.imagePicker}>
                            <Ionicons name="ios-add-outline" style={{color: '#b8b8b8' }} size={50} ></Ionicons>
                        </View>
                    </TouchableWithoutFeedback>
                  }
              </View>
              <View style={styles.detailCol}>
                  <Text>{'Status'}</Text>
              </View>
          </Animated.View>
    </>)
}

const LIST_ITEM_HEIGHT = 54;
const styles = StyleSheet.create({
    header: {
        backgroundColor: '#b8b8b8',
        paddingVertical: 8,
        paddingHorizontal: 30,
    },
    detail: {
        backgroundColor: "#ebebeb",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        paddingHorizontal: 30,
        borderBottomWidth: 1,
        borderColor: "#f4f4f6",
        minHeight: LIST_ITEM_HEIGHT,
    },
    detailCol: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
    },
    imagePicker: {
        marginTop: 10,
        width: 70,
        height: 70,
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#b8b8b8",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default ContainerImagePicker;