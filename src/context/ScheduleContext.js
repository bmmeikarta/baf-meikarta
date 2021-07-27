import { useContext } from "react";
import createDataContext from "./createDataContext";
import easymoveinApi from "../api/easymovein";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { navigate } from "../navigationRef";
import moment from "moment";
import jwtDecode from "jwt-decode";

const scheduleReducer = (state, action) => {
    switch (action.type) {
        case 'SCHEDULE_PATTERN_FETCH':
            return { ...state, schedulePattern: action.payload }
        case 'SCHEDULE_FETCH':
            return { ...state, ...action.payload };
        case 'SCHEDULE_CURRENT_SHIFT':
            return { ...state, currentShift: action.payload };
        case 'SCHEDULE_ACTIVE_FLOOR':
            return { ...state, activeFloor: action.payload };
        default:
            return state;
    }
};

const processError = (error) => {
    if(error.response.status == 401){
        Alert.alert('Authorization Failed', 'Silahkan melakukan login kembali', [
            { 
                text: 'Ok',
                onPress: async () => {
                    await AsyncStorage.removeItem('token');
                    navigate('loginFlow');
                }
            }
        ])
    }
}

const fetchSchedulePattern = dispatch => async () => {
    try {
        const response = await easymoveinApi.get('/get_schedule_pattern.php');
        dispatch({ type: 'SCHEDULE_PATTERN_FETCH', payload: response.data });
    } catch (error) {
        processError(error);
    }
};

const fetchSchedule = dispatch => async () => {
    try {
        const response = await easymoveinApi.get('/get_schedule.php');
        dispatch({ type: 'SCHEDULE_FETCH', payload: response.data });
    } catch (error) {
        processError(error);
    }
};

const getCurrentShift = dispatch => async (x) => {
    const token = await AsyncStorage.getItem('token');
    const userDetail = jwtDecode(token);
    
    const job = 'CSO'; // TODO: get from profile
    let shift = userDetail.data.shift;
    const hourNow = moment().format('H');

    if(!shift){
        if(hourNow >= 7 && hourNow < 15) shift = 1;
        if(hourNow >= 15 && hourNow < 23) shift = 2;
        if(hourNow >= 23 || hourNow < 7) shift = 3;
    }
    const mapWorkHour = [
        {
            job: 'CSO',
            work_hour: [
                {
                    shift: 1,
                    start: 7,
                    end: 15
                },
                {
                    shift: 2,
                    start: 15,
                    end: 23
                },
                {
                    shift: 3,
                    start: 23,
                    end: 7
                },
            ]
        }
    ];

    // check user shift
    const currentJob = mapWorkHour.find(v => v.job == job) || {};
    const currentShift = (currentJob.work_hour || [])
                            .find(v => {
                                // To return shift 3
                                if(v.end < v.start){
                                    return v.shift == shift && (hourNow >= v.start || hourNow < v.end)
                                }

                                return v.shift == shift && (hourNow >= v.start && hourNow < v.end)
                            }) || {};
    dispatch({ type: 'SCHEDULE_CURRENT_SHIFT', payload: currentShift });
}

const getActiveFloor = dispatch => (currentShift, schedulePattern, blocks) => {

    // untuk dapat jam ke berapa dr shift tsb, 
    // e.g. jam ke 1 dari shift
    const hourNow = moment().format('H');
    let jamKe = (hourNow - currentShift.start) + 1;

    // to handle shift 3
    if(currentShift.end < currentShift.start && hourNow < currentShift.start){
        jamKe = parseInt(hourNow) + 1;
    }

    const activeBlock = schedulePattern.find(v => v.block == blocks) || {};
    const blockPattern = activeBlock.patterns || [];
    const activeFloor = blockPattern['pattern_' + jamKe] || '';
    const activeIDX = activeFloor.split(',');
    
    dispatch({ type: 'SCHEDULE_ACTIVE_FLOOR', payload: activeIDX });
};

export const { Provider, Context} = createDataContext(
    scheduleReducer,
    { fetchSchedule, fetchSchedulePattern, getCurrentShift, getActiveFloor },

    // default state reduce
    { currentShift: {}, schedulePattern: [], activeFloor: [] }
)