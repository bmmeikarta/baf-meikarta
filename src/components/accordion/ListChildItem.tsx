import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import Animated, {
  useAnimatedRef,
  measure,
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
  runOnUI,
} from "react-native-reanimated";
import Checkmark from "./Checkmark";
import * as ImagePicker from 'expo-image-picker';
import * as BarcodeScanner from 'expo-barcode-scanner';
import { useEffect } from "react";

export interface ListItem {
  name: string;
  points: string;
}

interface ListItemProps {
  item: ListItem;
  isLast: boolean;
}

const ListChildItem = ({ navigation, item, isLast }) => {
    const bottomRadius = isLast ? 8 : 0;
    const checkmark = useSharedValue(false);
    const checkmarkProgress = useDerivedValue(() => 
        checkmark.value ? withSpring(1) : withTiming(0)
    );
    
    const takeImageHandler = () => {
        ImagePicker.launchCameraAsync();
    };

    const takeScannerHandler = () => {
      BarcodeScanner.requestPermissionsAsync();
    }

    return (
    <>
      
      <View
          style={[
              styles.container,
              {
              borderBottomLeftRadius: bottomRadius,
              borderBottomRightRadius: bottomRadius,
              },
          ]}
      >
          <Text style={styles.name}>{item.name}</Text>
          <TouchableWithoutFeedback onPress={() => navigation.navigate('ReportScanner')}>
              <Animated.View style={{marginRight: 30, flexDirection: 'row', alignItems: 'center' }}>
                {/* <Text style={{color: '#6e6e6e'}}>{'Scan '}</Text> */}
                <Ionicons name="ios-scan-circle-sharp" style={{color: '#b8b8b8' }} size={30} ></Ionicons>
              </Animated.View>
          </TouchableWithoutFeedback>
      </View>
      <BarcodeScanner.BarCodeScanner 
        onBarCodeScanned={() => takeScannerHandler}
      />
      {/* <Animated.View style={[styles.detail]}>
          <View style={styles.detailCol}>
              <Text>{'Foto'}</Text>
              <TouchableWithoutFeedback onPress={takeImageHandler}>
                  <View style={styles.imagePicker}>
                      <Ionicons name="ios-add-outline" style={{color: '#b8b8b8' }} size={50} ></Ionicons>
                  </View>
              </TouchableWithoutFeedback>
          </View>
          <View style={styles.detailCol}>
              <Text>{'Qty'}</Text>
          </View>
          <View style={styles.detailCol}>
              <Text>{'Status'}</Text>
          </View>
      </Animated.View> */}
    </>);
};

const LIST_ITEM_HEIGHT = 54;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff5f5",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#b8b8b8",
    height: LIST_ITEM_HEIGHT,
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
  name: {
    fontSize: 16,
  },
  pointsContainer: {
    borderRadius: 8,
    backgroundColor: "#44c282",
    padding: 8,
  },
  points: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ListChildItem;
