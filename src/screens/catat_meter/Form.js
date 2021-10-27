import _ from "lodash";
import React, { useContext, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput, Button, Alert, CheckBox } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Context as CatatMeterContext } from "../../context/CatatMeterContext";
import { Context as AuthContext } from "../../context/AuthContext";
import moment from "moment";
import RegularImagePicker from "../../components/RegularImagePicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Form = ({ navigation }) => {
  const { detailUnit, history, type, is_qc } = navigation.state.params;
  const { state: authState } = useContext(AuthContext);
  const { userDetail } = authState;

  const { state, addCatatMeter } = useContext(CatatMeterContext);
  const { catatMeterProblems } = state;

  const dataUnit = (detailUnit || [])[0];
  const listHistory = _.sortBy(history, ['bulan']);
  const lastInput = listHistory[listHistory.length - 1];

  const [showHistory, setShowHistory] = useState(false);
  const [showProblem, setShowProblem] = useState(false);
  const [form, setForm] = useState({
    unit_code: detailUnit.unit_code,
    bulan: moment().format('MM'),
    tahun: moment().format('YYYY'),
    qc_check: 1,
    qc_id: userDetail.data.id_user,
    meteran: null,
    pemakaian: null,
    foto: null
  });
  const [problems, setProblems] = useState([]);

  const onTakingImage = (data) => {
    handleChange('foto', data.photo);
  }

  const handleChange = (field, value) => {
    setForm({
      ...form,
      pemakaian: field == 'meteran' && value ? parseFloat(value) - parseFloat(lastInput.meteran) : parseFloat(lastInput.meteran),
      [field]: value,
    });
  }

  const handleChangeProblem = (idx_problem) => {
    const isExists = problems.find(v => v == idx_problem) !== undefined;
    if(isExists){
      const removed = problems.filter(p => p != idx_problem);
      setProblems(removed);
    }else{
      setProblems([...problems, idx_problem]);
    }
  }

  const validation = () => {
    if(is_qc) return true;
    for (const [key, value] of Object.entries(form)) {
      if(!value) return false;
    }

    return true;
  }
  const doSubmit = async () => {
    if(!validation()) return Alert.alert('Warning', 'Please complete the form');
    addCatatMeter({ ...form, problems: problems });
    navigation.navigate('CM_UnitList');
  }

  return (
    <>
      <ScrollView style={styles.screen}>
        <Text style={{ marginBottom: 20, fontSize: 24, fontWeight: 'bold', color: 'darkorange'}}>
          {`Meter ${type} Reading`}
        </Text>
        <View style={styles.box}>
          <Text style={styles.textTimer}>Detail Customer</Text>
          <View style={styles.row}>
            <Text style={[styles.textMD, { width: "30%" }]}>Nama</Text>
            <Text style={styles.textMD}>: {dataUnit.customer_name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.textMD, { width: "30%" }]}>Unit Code</Text>
            <Text style={styles.textMD}>: {dataUnit.unit_code}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.textMD, { width: "30%" }]}>Tanggal HO</Text>
            <Text style={styles.textMD}>: {dataUnit.date_ho}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.textMD, { width: "30%" }]}>Avg</Text>
            <Text style={styles.textMD}>: {type == 'Electric' ? dataUnit.avg_electric : dataUnit.avg_water}</Text>
          </View>

        </View>

        <View style={styles.box}>
          <View style={styles.row}>
            <Text style={[styles.textLG, { width: "90%" }]}>History Meteran</Text>
            <TouchableOpacity onPress={() => setShowHistory(!showHistory)}>
              <Ionicons name={showHistory ? 'ios-caret-up' : 'ios-caret-down'} size={20} style={{color: 'darkorange'}}></Ionicons>
            </TouchableOpacity>
            
          </View>
        </View>
        {showHistory &&
          listHistory.map((v, k) => {

            return <View key={k} style={styles.box}>
                <Text style={styles.textTimer}>{v.bulan_text}</Text>
                <View style={styles.row}>
                  <Text style={[styles.textMD, { width: "30%" }]}>Tanggal Input</Text>
                  <Text style={styles.textMD}>: {v.tanggalinput}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.textMD, { width: "30%" }]}>Petugas</Text>
                  <Text style={styles.textMD}>: {v.petugas}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.textMD, { width: "30%" }]}>Angka Meteran</Text>
                  <Text style={styles.textMD}>: {v.meteran}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.textMD, { width: "30%" }]}>Pemakaian</Text>
                  <Text style={styles.textMD}>: {v.pemakaian}</Text>
                </View>

              </View>
          })
        }
        <View style={[styles.box]}>
          <View style={styles.row}>
            <Text style={[styles.textLG, { width: "90%", color: 'red', fontWeight: 'bold' }]}>Problem</Text>
            <TouchableOpacity onPress={() => setShowProblem(!showProblem)}>
              <Ionicons name={showProblem ? 'ios-checkbox' : 'ios-checkbox-outline'} size={20} style={{color: 'red'}}></Ionicons>
            </TouchableOpacity>
            
          </View>
        </View>
        
          {showProblem && <View style={styles.box}>
            {
              catatMeterProblems.map((v, k) => {
                const checked = problems.find(p => p == v.idx) !== undefined;
                return <View style={{ flexDirection: 'row' }} key={k}>
                  <CheckBox 
                    value={checked}
                    onValueChange={() => handleChangeProblem(v.idx)}
                  />
                  <Text style={{ alignSelf: 'center' }}>{v.problem}</Text>
                </View>
              })
            }
            </View>
          }
        

        { !is_qc && 
          <View style={styles.box}>
            <Text style={{ color: 'red', fontStyle: 'italic' }}>Silahkan Input data untuk periode {moment().format('MMM YYYY')}</Text>
            <View style={styles.row}>
              <Text style={[styles.textMD, { width: "30%" }]}>Tanggal Input</Text>
              <Text style={styles.textMD}>: {moment().format('DD-MM-YYYY')}</Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.textMD, { width: "30%" }]}>Petugas</Text>
              <Text style={styles.textMD}>: {userDetail.data.full_name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.textMD, { width: "30%" }]}>Meteran</Text>
              <Text style={styles.textMD}>:</Text>
              <TextInput style={styles.input} onChangeText={(text) => handleChange('meteran', text)}></TextInput>
            </View>
            <View style={styles.row}>
              <Text style={[styles.textMD, { width: "30%" }]}>Pemakaian</Text>
              <Text style={styles.textMD}>: {form.pemakaian}</Text>
            </View>
            <View style={[styles.row, { marginTop: 10 }]}>
              <Text style={[styles.textMD, { width: "30%" }]}>Gambar</Text>
              <Text style={styles.textMD}>: </Text>
              <RegularImagePicker onTakingImage={onTakingImage} size={150}></RegularImagePicker>
            </View>

          </View>
        }
        <View style={[styles.row, { marginVertical: 20 }]}>
          <View style={[styles.container]}>
            <Button 
              buttonStyle={styles.button}
              title="Submit"
              onPress={() => doSubmit()}
            />
          </View>
          {/* <View style={[styles.container]}>
            <Button 
              buttonStyle={styles.button}
              title="Problem"
              color="#e83535"
              onPress={() => setShowProblem(!showProblem)}
            />
          </View> */}
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 2,
  },
  input: {
    borderBottomWidth: 2,
    minWidth: 100,
    borderColor: 'lightblue',
    marginLeft: 10
  },
  screen: {
    paddingHorizontal: 10,
    paddingBottom: 340,
    marginTop: 10
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 5,
  },
  button: {
    width: "100%",
    height: 50,
    alignSelf: "center",
  },
  bgRed: {
    backgroundColor: "red"
  },
  textTimer: {
    marginBottom: 10,
    fontWeight: 'bold', 
    fontSize: 18 
  },
  textLG: {
    fontSize: 18 
  },
  textMD: {
    fontSize: 16 
  },
  box: {
    backgroundColor: 'white', padding: 10, margin: 10, marginBottom: 5, borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
}
});

export default Form;