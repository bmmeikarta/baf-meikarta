import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import createDataContext from "./createDataContext";
import * as FileSystem from 'expo-file-system';
import easymoveinApi from "../api/easymovein";
import moment from "moment";
import jwtDecode from "jwt-decode";
import axios from "axios";

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
        case 'REPORT_FETCH_LOG':
            return { ...state, listLog: action.payload, loading: false };
        case 'REPORT_FETCH_PENDING_REPORT':
            return { ...state, listPendingReport: action.payload, loading: false };
        case 'REPORT_FETCH_CATEGORY':
            return { ...state, listCategory: action.payload, loading: false };

        case 'REPORT_SET_LOCAL_LIST_ITEM':
        case 'REPORT_SET_LIST_ITEM':
            return { ...state, listReportItem: action.payload, loading: false }

        case 'REPORT_SET_LOCAL_LIST_RESOLVED':
        case 'REPORT_SET_LIST_RESOLVED':
            return { ...state, listReportResolve: action.payload, loading: false }

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
    const serverLog = JSON.parse(await AsyncStorage.getItem('serverLog')) || [];
    const serverComplaint = JSON.parse(await AsyncStorage.getItem('serverComplaint')) || [];
    const serverCategory = JSON.parse(await AsyncStorage.getItem('serverCategory')) || [];
    const serverPendingReport = JSON.parse(await AsyncStorage.getItem('serverPendingReport')) || [];

    dispatch({ type: 'REPORT_SET_LOCAL_LIST_ITEM', payload: localReportItem });
    dispatch({ type: 'REPORT_SET_LOCAL_LIST_RESOLVED', payload: localResolvedReport });
    dispatch({ type: 'REPORT_FETCH_LOG', payload: serverLog });
    dispatch({ type: 'REPORT_FETCH_COMPLAINT', payload: serverComplaint });
    dispatch({ type: 'REPORT_FETCH_CATEGORY', payload: serverCategory });
    dispatch({ type: 'REPORT_FETCH_PENDING_REPORT', payload: serverPendingReport });
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
            // MERGE listReportUpload from local
            data.listReportUpload = [ ...data.listReportUpload, ...checkExisting.listReportUpload ];
        }

        newReportItem = [ ...newReportItem, data ];
        await AsyncStorage.setItem('localReportItem', JSON.stringify(newReportItem));

        // dispatch({ type: 'REPORT_SET_LIST_ITEM', payload: newReportItem });
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
        let source = axios.CancelToken.source();
        setTimeout(() => { source.cancel(`Timeout`) }, 5000);

        const response = await easymoveinApi.get('/get_asset.php', { cancelToken: source.token });
        const data = response.data || [];
        const bafAsset = data.baf_asset || [];

        await AsyncStorage.setItem('localAssetItem', JSON.stringify(bafAsset));

        dispatch({ type: 'REPORT_FETCH_ASSET', payload: bafAsset });
    } catch (error) {
        console.log(error);
        Alert.alert('Error', `Failed to fetch Asset, you're offline now, please sync your data every 1 hour`);
        dispatch({ type: 'REPORT_SET_LOADING', payload: false });
        // processError(error);
    }
};

const fetchComplaint = dispatch => async () => {
    try {
        dispatch({ type: 'REPORT_SET_LOADING', payload: true });
        const token = await AsyncStorage.getItem('token');
        const userDetail = jwtDecode(token);
        const block = userDetail.data.absensi_block;
        const userID = userDetail.data.id_user;
        const profileID = userDetail.data.profile_id;
        // console.log('/get_list_report.php?block=' + block + '&profile_id=' + profileID + '&id_user=' + userID)
        let source = axios.CancelToken.source();
        setTimeout(() => { source.cancel(`Timeout`) }, 5000);
        
        const response = await easymoveinApi.get('/get_list_report.php?block=' + block + '&profile_id=' + profileID + '&id_user=' + userID, { cancelToken: source.token });
        const data = response.data || [];
        const bafReport = data.baf_report || [];

        await AsyncStorage.setItem('serverComplaint', JSON.stringify(bafReport));
        
        dispatch({ type: 'REPORT_FETCH_COMPLAINT', payload: bafReport });
    } catch (error) {
        console.log(error);
        // processError(error);
        Alert.alert('Error', `Failed to fetch Complaint, you're offline now, please sync your data every 1 hour`);
        dispatch({ type: 'REPORT_SET_LOADING', payload: false });
    }
};

const fetchLog = dispatch => async () => {
    try {
        dispatch({ type: 'REPORT_SET_LOADING', payload: true });
        const token = await AsyncStorage.getItem('token');
        const userDetail = jwtDecode(token);
        const userID = userDetail.data.id_user;

        let source = axios.CancelToken.source();
        setTimeout(() => { source.cancel(`Timeout`) }, 5000);
        
        const response = await easymoveinApi.get('/get_baf_log.php?id_user=' + userID, { cancelToken: source.token });
        const data = response.data || [];
        const bafLog = data.baf_log || [];

        await AsyncStorage.setItem('serverLog', JSON.stringify(bafLog));
        
        dispatch({ type: 'REPORT_FETCH_LOG', payload: bafLog });
    } catch (error) {
        console.log(error);
        // processError(error);
        Alert.alert('Error', `Failed to fetch Log, you're offline now, please sync your data every 1 hour`);
        dispatch({ type: 'REPORT_SET_LOADING', payload: false });
    }
};

const fetchPendingReport = dispatch => async () => {
    try {
        dispatch({ type: 'REPORT_SET_LOADING', payload: true });
        const token = await AsyncStorage.getItem('token');
        const userDetail = jwtDecode(token);
        const userID = userDetail.data.id_user;

        let source = axios.CancelToken.source();
        setTimeout(() => { source.cancel(`Timeout`) }, 10000);

        const response = await easymoveinApi.get('/get_pending_report.php?block=' + userDetail.data.absensi_block, { cancelToken: source.token });
        const data = response.data || [];
        const pendingReport = data.pending_report || [];

        await AsyncStorage.setItem('serverPendingReport', JSON.stringify(pendingReport));
        
        dispatch({ type: 'REPORT_FETCH_PENDING_REPORT', payload: pendingReport });
    } catch (error) {
        console.log(error);
        // processError(error);
        Alert.alert('Error', `Failed to fetch Pending Report, you're offline now, please sync your data every 1 hour`);
        dispatch({ type: 'REPORT_SET_LOADING', payload: false });
    }
};

const fetchCategory = dispatch => async () => {
    try {
        dispatch({ type: 'REPORT_SET_LOADING', payload: true });

        let source = axios.CancelToken.source();
        setTimeout(() => { source.cancel(`Timeout`) }, 5000);

        const response = await easymoveinApi.get('/get_category.php', { cancelToken: source.token });
        const data = response.data || [];
        const category = data.category || [];
        // title: "Keamanan",
        // questions: [
        //     { 
        //     label: "Object Hilang / Pencurian",
        //     items: [
        //         { name: 'APAR', status: '' },
        //         { name: 'Lampu Lorong', status: '' },
        //         { name: 'Sprinkler', status: '' },
        //         { name: 'Smoke Detector', status: '' },
        //         { name: 'Speaker', status: '' },
        //         { name: 'Hydrant', status: '' },
        //         { name: 'CCTV', status: '' },
        //         { name: 'Building / Exit Signage', status: '' },
        //         { name: 'Lampu TL Emergency Exit', status: '' },
        //     ]
        //     },
        const categoryMapping = category
            .filter(cat => cat.parent == null)
            .map(c => {
                let cat = {};
                cat.title = c.unit_desc;
                cat.sku_code = c.sku_code;
                cat.questions = category
                                .filter(v => v.parent == c.sku_code)
                                .map(q => {
                                    let question = {};
                                    question.label = q.unit_desc;
                                    question.sku_code = q.sku_code;
                                    question.items = category
                                            .filter(v => v.parent == q.sku_code)
                                            .map(v => {
                                                let item = {};
                                                item.name = v.unit_desc;
                                                item.sku_code = v.sku_code;
                                                item.status = null;
                                                return item;
                                            })
                                    return question;
                                });
                return cat;
            });

        await AsyncStorage.setItem('serverCategory', JSON.stringify(categoryMapping));
        
        dispatch({ type: 'REPORT_FETCH_CATEGORY', payload: categoryMapping });
    } catch (error) {
        console.log(error);
        // processError(error);
        Alert.alert('Error', `Failed to fetch Category, you're offline now, please sync your data every 1 hour`);
        dispatch({ type: 'REPORT_SET_LOADING', payload: false });
    }
};

const doPostReport = dispatch => async (val) => {
    try {
        const localReportItem = JSON.parse(await AsyncStorage.getItem('localReportItem')) || [];
        let tempReportItem = localReportItem;
        await localReportItem.map( async headerLocal => {
            dispatch({ type: 'REPORT_SET_LOADING', payload: true });
            const bafLogData = {
                data: { ...headerLocal, listReportUpload: [] },
            }
            let tempItem = headerLocal;

            let source = axios.CancelToken.source();
            setTimeout(() => { source.cancel(`Timeout`) }, 5000);

            await easymoveinApi.post('/post_baf_log.php', JSON.stringify(bafLogData), { cancelToken: source.token })
                .then( async (res) => {
                    console.log(res);
                    if(res.status){
                        const listReportUpload = headerLocal.listReportUpload || [];
                        await listReportUpload.map(async itemUpload => {
                            const photo = itemUpload.photo_before || '';
                            // console.log('>>>>', itemUpload)
                            const base64 = await FileSystem.readAsStringAsync(photo, { encoding: 'base64' });
                            
                            const uploadData = {
                                data: { ...headerLocal, ...itemUpload, listReportUpload: [] },
                                photo: base64
                            }
                            // formData.append('photo', image);

                            let abort = axios.CancelToken.source();
                            setTimeout(() => { abort.cancel(`Timeout`) }, 5000);

                            const response = await easymoveinApi.post('/post_report.php', JSON.stringify(uploadData), { cancelToken: abort.token });
                            
                            if(response.data.status == true){
                                // DO DELETE LOCAL DATA
                                console.log('>>>>>>>>>>>>>>>');
                                console.log(tempItem)
                                // console.log(tempItem.find(v => v == headerLocal));
                                const newListReportUpload = (tempItem.listReportUpload || []).filter(v => v != itemUpload);
                                const newListReportItem = tempReportItem.filter(v => v != headerLocal);
                                tempItem = [ ...newListReportItem, {...headerLocal, listReportUpload: newListReportUpload} ];
                                

                                await AsyncStorage.setItem('localReportItem', JSON.stringify(tempItem));
                            }else{
                                const errMsg = response.data.message;
                                Alert.alert('Error', `Failed to upload report, you're offline now, please sync your data every 1 hour`)
                            }
                            console.log('================');
                            console.log(response.data);
                        });
                    }
                })
                .catch((res) => {
                    console.log(res);
                    Alert.alert('Info', `Failed sync to baf_log, you're offline now, please sync your data every 1 hour`);
                    dispatch({ type: 'REPORT_SET_LOADING', payload: false });
                });

                if(tempItem.listReportUpload.length == 0){
                    // DO DELETE LOCAL DATA
                    const newListReportItem = localReportItem.filter(v => v != headerLocal);
                    tempReportItem = newListReportItem;

                    await AsyncStorage.setItem('localReportItem', JSON.stringify(newListReportItem));
                }

            dispatch({ type: 'REPORT_SET_LOCAL_LIST_ITEM', payload: tempReportItem });
        })
    } catch (error) {
        console.log(error);
        // processError(error);
        dispatch({ type: 'REPORT_SET_LOADING', payload: false });
    }
};

const doPostResolve = dispatch => async (val) => {
    try {
        dispatch({ type: 'REPORT_SET_LOADING', payload: true });
        const localResolvedReport = JSON.parse(await AsyncStorage.getItem('localResolvedReport')) || [];
        let tempItem = localResolvedReport;

        await localResolvedReport.map(async headerLocal => {
            const photo = headerLocal.photo || '';
            const base64 = await FileSystem.readAsStringAsync(photo, { encoding: 'base64' });

            const uploadData = {
                data: { ...headerLocal, id_report: headerLocal.idReport },
                photo: base64
            }
            // formData.append('photo', image);

            let abort = axios.CancelToken.source();
            setTimeout(() => { abort.cancel(`Timeout`) }, 5000);

            const response = await easymoveinApi.post('/post_resolve.php', JSON.stringify(uploadData), { cancelToken: abort.token });
            if(response.data.status == true){
                // DO DELETE LOCAL DATA
                const newListReportItem = tempItem.filter(v => v != headerLocal);
                tempItem = [ ...newListReportItem ];

                await AsyncStorage.setItem('localResolvedReport', JSON.stringify(tempItem));
            }
            console.log('================');
            console.log(response.data);
        });

        dispatch({ type: 'REPORT_SET_LOCAL_LIST_RESOLVED', payload: tempItem });
    } catch (error) {
        console.log(error);
        // processError(error);
        Alert.alert('Error', `Failed to upload Resolve, you're offline now, please sync your data every 1 hour`);
        dispatch({ type: 'REPORT_SET_LOADING', payload: false });
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
    { doPostReport, doPostResolve, fetchAsset, fetchComplaint, fetchLog, fetchPendingReport, fetchCategory, getReportState, addReportItem, addReportResolve, addScanItem, addUploadItem, setCurrentZone, setCurrentScan, resetReportScan, resetReportTemp, deleteScanItem, localToState },

    // default state reduce
    { loading: false, listAsset: [], listComplaint: [], listLog: [], listPendingReport: [], listReportItem: [], listCategory: [], listReportResolve: [], listReportUpload: [], listReportScan: [], currentReportAsset:[], currentReportZone: {}, currentReportScan: {} }
)