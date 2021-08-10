import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import createDataContext from "./createDataContext";
import * as FileSystem from 'expo-file-system';
import easymoveinApi from "../api/easymovein";
import moment from "moment";
import jwtDecode from "jwt-decode";

const reportReducer = (state, action) => {
    switch (action.type) {
        case 'REPORT_SET_TEST':
            return { ...state, testVal: action.payload };
        case 'REPORT_SET_LOADING':
            return { ...state, loading: action.payload };
        case 'REPORT_FETCH_ASSET':
            return { ...state, listAsset: action.payload, lastUpdateDB: moment().format('YYYY-MM-DD HH:mm:ss'), loading: false };
        case 'REPORT_FETCH_COMPLAINT':
            return { ...state, listComplaint: action.payload, loading: false };

        case 'REPORT_SET_LOCAL_LIST_ITEM':
        case 'REPORT_SET_LIST_ITEM':
            return { ...state, listReportItem: action.payload }

        case 'REPORT_SET_LOCAL_LIST_RESOLVED':
        case 'REPORT_SET_LIST_RESOLVED':
            return { ...state, listReportResolve: action.payload }

        case 'REPORT_SET_LIST_SCAN':
            return { ...state, listReportScan: [...state.listReportScan, action.payload] }
        case 'REPORT_SET_LIST_UPLOAD':
            return { ...state, listReportUpload: [...state.listReportUpload, action.payload] }
        case 'REPORT_RESET_LIST_SCAN':
            return { ...state, listReportScan: [] }
        case 'REPORT_RESET_LIST_UPLOAD':
            return { ...state, listReportUpload: [] }
        case 'REPORT_RESET_ALL_TEMP_LIST':
            return { ...state, listReportScan: [], listReportUpload: [] }
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
    const localReportItem = JSON.parse(await AsyncStorage.getItem('localReportItem')) || [];
    const localResolvedReport = JSON.parse(await AsyncStorage.getItem('localResolvedReport')) || [];
    dispatch({ type: 'REPORT_SET_LOCAL_LIST_ITEM', payload: localReportItem });
    dispatch({ type: 'REPORT_SET_LOCAL_LIST_RESOLVED', payload: localResolvedReport });
}
const getReportState = dispatch => async() => {
    dispatch({ type: 'DEFAULT' });
};

const addReportItem = dispatch => async(data) => {
    try {
        // await AsyncStorage.removeItem('localReportItem');
        const token = await AsyncStorage.getItem('token');
        const userDetail = jwtDecode(token);
        let shift = userDetail.data.shift;
        const id_user = userDetail.data.id_user;

        //BYPASS ADMIN, DELETE LATER
        const hourNow = moment().format('H');
        if(!shift){
            if(hourNow >= 8 && hourNow < 15) shift = 1;
            if(hourNow >= 15 && hourNow < 22) shift = 2;
            if(hourNow >= 22 || hourNow < 5) shift = 3;
        }
        // =============================================

        data.shift_id = shift;
        data.created_by = id_user;
        data.created_at = moment().format('YYYY-MM-DD HH:mm:ss');

        const localReportItem = JSON.parse(await AsyncStorage.getItem('localReportItem')) || [];
        
        const checkExisting = (localReportItem || []).find(v => 
            v.blocks == data.blocks && v.floor == data.floor && v.tower == data.tower && v.zone == data.zone);

        let newReportItem = localReportItem;
        if(checkExisting){
            const deletedLocalReportItem = localReportItem.filter(v => v != checkExisting);
            newReportItem = [ ...deletedLocalReportItem ];
        }
        
        // MERGE listReportUpload from local
        data.listReportUpload = [ ...data.listReportUpload, ...checkExisting.listReportUpload ];
        
        newReportItem = [ ...newReportItem, data ];
        await AsyncStorage.setItem('localReportItem', JSON.stringify(newReportItem));

        dispatch({ type: 'REPORT_SET_LIST_ITEM', payload: newReportItem });
    } catch (error) {
        console.log(error);
    }
};

const addReportResolve = dispatch => async(data) => {
    try {
        // await AsyncStorage.removeItem('localReportItem');
        const token = await AsyncStorage.getItem('token');
        const userDetail = jwtDecode(token);
        const id_user = userDetail.data.id_user;

        data.resolved_by = id_user;
        data.resolved_at = moment().format('YYYY-MM-DD HH:mm:ss');

        const localResolvedReport = JSON.parse(await AsyncStorage.getItem('localResolvedReport')) || [];
        
        const checkExisting = (localResolvedReport || []).find(v => 
            v.idReport == data.idReport);

        let newResolvedReport = localResolvedReport;
        if(checkExisting){
            const deletedlocalResolvedReport = localResolvedReport.filter(v => v != checkExisting);
            newResolvedReport = [ ...deletedlocalResolvedReport ];
        }
        
        newResolvedReport = [ ...newResolvedReport, data ];
        await AsyncStorage.setItem('localResolvedReport', JSON.stringify(newResolvedReport));

        dispatch({ type: 'REPORT_SET_LIST_RESOLVED', payload: newResolvedReport });
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

const addUploadItem = dispatch => async(data) => {
    dispatch({ type: 'REPORT_SET_LIST_UPLOAD', payload: data });
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

const resetReportTemp = dispatch => async(data) => {
    dispatch({ type: 'REPORT_RESET_ALL_TEMP_LIST' });
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

const fetchComplaint = dispatch => async () => {
    try {
        dispatch({ type: 'REPORT_SET_LOADING', payload: true });
        const response = await easymoveinApi.get('/get_list_report.php');
        const data = response.data || [];
        const bafReport = data.baf_report || [];

        await AsyncStorage.setItem('serverReportItem', JSON.stringify(bafReport));

        dispatch({ type: 'REPORT_FETCH_COMPLAINT', payload: bafReport });
    } catch (error) {
        console.log(error);
        // processError(error);
    }
};

const doPostReport = dispatch => async (val) => {
    try {
        const localReportItem = JSON.parse(await AsyncStorage.getItem('localReportItem')) || [];

        const reqPost = await localReportItem.map( async v => {
            const listReportUpload = v.listReportUpload || [];
            await listReportUpload.map(async u => {
                const photo = u.photo_before || '';
                const photoName = photo.split('/').pop();
                const image= "data:image/jpeg;base64," + (Platform.OS === 'ios' ? photo.replace('file://', '') : photo);
                const base64 = await FileSystem.readAsStringAsync(photo, { encoding: 'base64' });

                const uploadData = {
                    data: { ...v, ...u, listReportUpload: [] },
                    photo: base64
                }
                // formData.append('photo', image);

                const response = await easymoveinApi.post('/post_report.php', JSON.stringify(uploadData));

                console.log('================');
                console.log(response.data);
            });
        })
    } catch (error) {
        console.log(error);
        // processError(error);
    }
};

const doPostResolve = dispatch => async (val) => {
    try {
        const localResolvedReport = JSON.parse(await AsyncStorage.getItem('localResolvedReport')) || [];

        await localResolvedReport.map(async u => {
            const photo = u.photo || '';
            const base64 = await FileSystem.readAsStringAsync(photo, { encoding: 'base64' });

            const uploadData = {
                data: { ...u, id_report: u.idReport },
                photo: base64
            }
            // formData.append('photo', image);

            const response = await easymoveinApi.post('/post_resolve.php', JSON.stringify(uploadData));

            console.log('================');
            console.log(response.data);
        });
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
    { doPostReport, doPostResolve, fetchAsset, fetchComplaint, getReportState, addReportItem, addReportResolve, addScanItem, addUploadItem, setCurrentZone, setCurrentScan, resetReportScan, resetReportTemp, deleteScanItem, localToState },

    // default state reduce
    { loading: false, listAsset: [], listComplaint: [], listReportItem: [], listReportResolve: [], listReportUpload: [], listReportScan: [], currentReportAsset:[], currentReportZone: {}, currentReportScan: {} }
)