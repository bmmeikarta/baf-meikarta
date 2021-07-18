import { useContext } from "react";
import createDataContext from "./createDataContext";
import easymoveinApi from "../api/easymovein";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { navigate } from "../navigationRef";
import moment from "moment";

const scheduleReducer = (state, action) => {
    switch (action.type) {
        case 'SCHEDULE_PATTERN_FETCH':
            return { ...state, schedulePattern: action.payload }
        case 'SCHEDULE_FETCH':
            return { ...state, ...action.payload };
        case 'SCHEDULE_CURRENT_SHIFT':
            return { ...state, currentShift: action.payload };
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

const getCurrentShift = dispatch => (x) => {
    const job = 'CSO'; // TODO: get from profile
    const shift = 2; // TODO: get from profile
    const hourNow = moment().format('H');

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
                            .find(v => 
                                v.shift == shift && 
                                hourNow >= v.start &&  
                                hourNow < v.end 
                            ) || {};
    dispatch({ type: 'SCHEDULE_CURRENT_SHIFT', payload: currentShift });
}

export const { Provider, Context} = createDataContext(
    scheduleReducer,
    { fetchSchedule, fetchSchedulePattern, getCurrentShift },

    // default state reduce
    { currentShift: {}, schedulePattern: [] }
)