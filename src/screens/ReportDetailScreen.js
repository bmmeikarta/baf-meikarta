import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Button } from "react-native-elements";
import { NavigationEvents } from "react-navigation";

import List, { List as ListModel } from "../components/accordion/List";

const listKebersihan = {
  title: "Kebersihan",
  questions: [],
};

const listKeamanan = {
  title: "Keamanan",
  questions: [
    { 
      label: "Object Hilang / Pencurian",
      items: [
        { name: 'APAR', status: '' },
        { name: 'Lampu Lorong', status: '' },
        { name: 'Sprinkler', status: '' },
        { name: 'Smoke Detector', status: '' },
        { name: 'Speaker', status: '' },
        { name: 'Hydrant', status: '' },
        { name: 'CCTV', status: '' },
        { name: 'Building / Exit Signage', status: '' },
        { name: 'Lampu TL Emergency Exit', status: '' },
      ]
    },
    { 
      label: "Personel Mencurigakan",
      items: []
    },
    { 
      label: "Pelanggaran Ketertiban Penghuni",
      items: []
    },
    { 
      label: "Pengerusakan Assets / Grafiti",
      items: []
    },
  ],
};

const listFungsional = {
  title: "Fungsional",
  questions: [
    { 
      label: "Object Rusak",
      items: [
        { name: 'APAR', status: '' },
        { name: 'Lampu Lorong', status: '' },
        { name: 'Sprinkler', status: '' },
        { name: 'Smoke Detector', status: '' },
        { name: 'Speaker', status: '' },
        { name: 'Hydrant', status: '' },
        { name: 'CCTV', status: '' },
        { name: 'Building / Exit Signage', status: '' },
        { name: 'Lampu TL Emergency Exit', status: '' },
      ]
    },
    { 
      label: "Others",
      items: []
    },
  ],
};

const styles = StyleSheet.create({
  screen: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  button: {
    width: "100%",
    height: 50,
    alignSelf: "center",
},
});

const ReportDetailScreen = ({ navigation, state }) => {
  const { headerTitle } = navigation.state.params;
  const doSubmit = () => {};
  return (<>
      <ScrollView style={styles.screen}>
        <Text style={{fontSize: 24, fontWeight: 'bold'}}>{headerTitle}</Text>
        <List navigation={navigation} key={`kebersihan`} list={listKebersihan} />
        <List navigation={navigation} key={`keamanan`} list={listKeamanan} />
        <List navigation={navigation} key={`fungsional`} list={listFungsional} />
        <View style={{ marginTop: 20 }}>
          <Button 
              buttonStyle={styles.button}
              title="Submit" 
              onPress={()=> console.log('Submitted')} 
          />
        </View>
        <View style={{ marginBottom: 40 }}></View>
      </ScrollView>
    </>
  );
};

export default ReportDetailScreen;