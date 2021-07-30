import AsyncStorage from "@react-native-async-storage/async-storage";
import createDataContext from "./createDataContext";

const reportReducer = (state, action) => {
    switch (action.type) {
        case 'REPORT_SET_LIST_ITEM':
            return { ...state, listReportItem: [...state.listReportItem, action.payload] }
        case 'REPORT_SET_LOCAL_LIST_ITEM':
            return { ...state, listReportItem: action.payload }
        case 'REPORT_SET_LIST_SCAN':
            return { ...state, listReportScan: [...state.listReportScan, action.payload] }
        case 'REPORT_RESET_LIST_SCAN':
            return { ...state, listReportScan: [] }
        case 'REPORT_DELETE_SCAN_ITEM':
            const listReportScan = state.listReportScan || [];
            const deleteScanData = action.payload;

            const newListReportScan = listReportScan.filter(v => v != deleteScanData);
            return { ...state, listReportScan: newListReportScan }
        case 'REPORT_SET_CURRENT_ZONE':
            return { ...state, currentReportZone: action.payload }
        case 'REPORT_SET_CURRENT_SCAN':
            return { ...state, currentReportScan: action.payload }
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
    dispatch({ type: 'REPORT_SET_LIST_ITEM', payload: data });
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
    dispatch({ type: 'REPORT_SET_CURRENT_ZONE', payload: data });
};

const setCurrentScan = dispatch => async(data) => {
    dispatch({ type: 'REPORT_SET_CURRENT_SCAN', payload: data });
};

const resetReportScan = dispatch => async(data) => {
    dispatch({ type: 'REPORT_RESET_LIST_SCAN' });
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
    { getReportState, addReportItem, addScanItem, setCurrentZone, setCurrentScan, resetReportScan, deleteScanItem, localToState },

    // default state reduce
    { listReportItem: [], listReportScan: [], currentReportZone: {}, currentReportScan: {} }
)