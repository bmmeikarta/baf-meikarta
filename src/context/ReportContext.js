import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import createDataContext from "./createDataContext";
import * as FileSystem from 'expo-file-system';
import easymoveinApi from "../api/easymovein";
import moment from "moment";

const reportReducer = (state, action) => {
    switch (action.type) {
        case 'REPORT_SET_LOADING':
            return { ...state, loading: action.payload };
        case 'REPORT_FETCH_ASSET':
            return { ...state, listAsset: action.payload, lastUpdateDB: moment().format('YYYY-MM-DD HH:mm:ss'), loading: false };
        case 'REPORT_SET_LIST_ITEM':
            return { ...state, listReportItem: action.payload }
        case 'REPORT_SET_LOCAL_LIST_ITEM':
            return { ...state, listReportItem: action.payload }
        case 'REPORT_SET_LIST_SCAN':
            return { ...state, listReportScan: [...state.listReportScan, action.payload] }
        case 'REPORT_RESET_LIST_SCAN':
            return { ...state, listReportScan: [] }
        case 'REPORT_DELETE_REPORT_ITEM':
            const listReportItem = state.listReportItem || [];
            const deleteReportData = action.payload;

            const newListReportItem = listReportItem.filter(v => v != deleteReportData);
            return { ...state, listReportItem: newListReportItem }
        case 'REPORT_DELETE_SCAN_ITEM':
            const listReportScan = state.listReportScan || [];
            const deleteScanData = action.payload;

            const newListReportScan = listReportScan.filter(v => v != deleteScanData);
            return { ...state, listReportScan: newListReportScan }
        case 'REPORT_SET_CURRENT_ZONE':
            return { ...state, currentReportZone: action.payload }
        case 'REPORT_SET_CURRENT_SCAN':
            return { ...state, currentReportScan: action.payload }
        case 'REPORT_SET_CURRENT_ASSET':
            return { ...state, currentReportAsset: action.payload }
        default:
            return state;
    }
};

const localToState = dispatch => async() => {
    const localReportItem = await AsyncStorage.getItem('listReportItem') || [];
    dispatch({ type: 'REPORT_SET_LOCAL_LIST_ITEM', payload: localReportItem });
}
const getReportState = dispatch => async() => {
    dispatch({ type: 'DEFAULT' });
};

const addReportItem = dispatch => async(data) => {
    try {
        // await AsyncStorage.removeItem('localReportItem');
        const localReportItem = JSON.parse(await AsyncStorage.getItem('localReportItem')) || [];

        const checkExisting = (localReportItem || []).find(v => 
            v.blocks == data.blocks && v.floor == data.floor && v.tower == data.tower && v.zone == data.zone);

        let newReportItem = [];
        if(checkExisting){
            const deletedLocalReportItem = localReportItem.filter(v => v != checkExisting);
            newReportItem = [ ...deletedLocalReportItem ];
        }
        
        newReportItem = [ ...newReportItem, data ];
        await AsyncStorage.setItem('localReportItem', JSON.stringify(newReportItem));

        dispatch({ type: 'REPORT_SET_LIST_ITEM', payload: newReportItem });
    } catch (error) {
        console.log(error);
    }
};

const deleteScanItem = dispatch => async(data) => {
    dispatch({ type: 'REPORT_DELETE_SCAN_ITEM', payload: data });
};

const addScanItem = dispatch => async(listReportScan, data) => {
    const checkExisting = (listReportScan || []).find(v => 
                            v.blocks == data.blocks && v.floor == data.floor && v.tower == data.tower && v.zone == data.zone &&
                            v.category == data.category && v.problem == data.problem && v.item_name == data.item_name);

    if(checkExisting) dispatch({ type: 'REPORT_DELETE_SCAN_ITEM', payload: checkExisting });
    dispatch({ type: 'REPORT_SET_LIST_SCAN', payload: data });
};

const setCurrentZone = dispatch => async(data) => {
    try {
        const localAsset = JSON.parse(await AsyncStorage.getItem('localAssetItem')) || [];
        const filterAsset = localAsset.filter(v => v.blocks == data.blocks && v.tower == data.tower && v.floor == data.floor && v.zone == data.zone);
        
        dispatch({ type: 'REPORT_SET_CURRENT_ASSET', payload: filterAsset });
        dispatch({ type: 'REPORT_SET_CURRENT_ZONE', payload: data });
    } catch (error) {
        // console.log(error);
    }
};

const setCurrentScan = dispatch => async(data) => {
    dispatch({ type: 'REPORT_SET_CURRENT_SCAN', payload: data });
};

const resetReportScan = dispatch => async(data) => {
    dispatch({ type: 'REPORT_RESET_LIST_SCAN' });
};

const fetchAsset = dispatch => async () => {
    try {
        dispatch({ type: 'REPORT_SET_LOADING', payload: true });
        const response = await easymoveinApi.get('/get_asset.php');
        const data = response.data || [];
        const bafAsset = data.baf_asset || [];

        await AsyncStorage.setItem('localAssetItem', JSON.stringify(bafAsset));

        dispatch({ type: 'REPORT_FETCH_ASSET', payload: bafAsset });
    } catch (error) {
        console.log(error);
        // processError(error);
    }
};

const defaultList = {
    "blocks": "51022",
    "floor": "1",
    "listReportScan": [
       {
        "blocks": "51022",
        "category": "Keamanan",
        "floor": "1",
        "item_name": "APAR",
        "problem": "Object Hilang / Pencurian",
        "scan_item": [
          "https://tesss",
          "https://tesss",
        ],
        "tower": "1B",
        "zone": 1,
      },
    ],
    "tower": "1B",
    "zone": 1,
  };

export const { Provider, Context} = createDataContext(
    reportReducer,
    { fetchAsset, getReportState, addReportItem, addScanItem, setCurrentZone, setCurrentScan, resetReportScan, deleteScanItem, localToState },

    // default state reduce
    { loading: false, listAsset: [], listReportItem: [], listReportScan: [], currentReportAsset:[], currentReportZone: {}, currentReportScan: {} }
)