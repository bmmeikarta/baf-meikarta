import { useContext } from "react";
import createDataContext from "./createDataContext";
import easymoveinApi from "../api/easymovein";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { navigate } from "../navigationRef";
import moment from "moment";
import jwtDecode from "jwt-decode";
import _, { concat } from "lodash";
import axios from "axios";

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

const mapWorkHour = [
    {
        job: 12, // CSO
        work_hour: [
            {
                shift: 1,
                start: 8,
                end: 15
            },
            {
                shift: 2,
                start: 15,
                end: 22
            },
            {
                shift: 3,
                start: 22,
                end: 5
            },
        ]
    },
    // TODO: JANGAN LUPA GANTI 
    {
        job: 14, // SEC
        work_hour: [
            {
                shift: 1,
                start: 5,
                end: 20
            },
            {
                shift: 2,
                start: 20,
                end: 8
            },
        ]
    },
    {
        job: 21, // ENG
        work_hour: [
            {
                shift: 1,
                start: 8,
                end: 15
            },
            {
                shift: 2,
                start: 15,
                end: 22
            },
            {
                shift: 3,
                start: 22,
                end: 5
            },
        ]
    }
];

const processError = (error) => {
    console.log(error);
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
        let abort = axios.CancelToken.source();
        setTimeout(() => { abort.cancel(`Timeout`) }, 10000);

        const response = await easymoveinApi.get('/get_schedule_pattern.php', { cancelToken: abort.token });
        dispatch({ type: 'SCHEDULE_PATTERN_FETCH', payload: response.data });
    } catch (error) {
        processError(error);
        Alert.alert('Error', `Failed to fetch Schedule Pattern, you're offline now, please sync your data every 1 hour`);
    }
};

const fetchSchedule = dispatch => async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        const userDetail = jwtDecode(token);
        
        const block = userDetail.data.absensi_block || '51022';
        
        let abort = axios.CancelToken.source();
        setTimeout(() => { abort.cancel(`Timeout`) }, 10000);

        const response = await easymoveinApi.get('/get_schedule.php?block='+ block, { cancelToken: abort.token });
        const data = response.data || [];
        const masterUnit = data.master_unit || [];
        const uniqTower = _.uniq(_.map(masterUnit, 'tower'));

        uniqTower.map(tower => {
            const concatData = [
                { blocks: masterUnit[0].blocks, block_name: masterUnit[0].block_name, floor: 'Rooftop', tower: tower },
                { blocks: masterUnit[0].blocks, block_name: masterUnit[0].block_name, floor: 'Lobby', tower: tower }
            ];
            data.master_unit = data.master_unit.concat(concatData);
        });
        
        dispatch({ type: 'SCHEDULE_FETCH', payload: data });
    } catch (error) {
        processError(error);
        Alert.alert('Error', `Failed to fetch Schedule, you're offline now, please sync your data every 1 hour`);
    }
};

const getCurrentShift = dispatch => async (x) => {
    const token = await AsyncStorage.getItem('token');
    const userDetail = jwtDecode(token);
    
    let job = parseInt(userDetail.data.profile_id); // TODO: get from profile
    let shift = userDetail.data.shift;
    // console.log(shift)
    const hourNow = moment().format('H');
    // if([21,14,12].includes(job) == false) job = 12; // DEFAULT CSO 

    if(!shift){
        if(hourNow >= 8 && hourNow < 15) shift = 1;
        if(hourNow >= 15 && hourNow < 22) shift = 2;
        if(hourNow >= 22 || hourNow < 5) shift = 3;
    }
    
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
    // console.log(currentShift, job, shift);
    dispatch({ type: 'SCHEDULE_CURRENT_SHIFT', payload: currentShift });
}

const getActiveFloor = dispatch => async(currentShift, schedulePattern, blocks) => {
    const token = await AsyncStorage.getItem('token');
    const userDetail = jwtDecode(token);
    const block = userDetail.data.absensi_block;
    
    let job = userDetail.data.profile_id;

    // if([21,14,12].includes(job) == false) job = 12; // DEFAULT CSO 

    // untuk dapat jam ke berapa dr shift tsb, 
    // e.g. jam ke 1 dari shift
    const hourNow = moment().format('H');
    let jamKe = (hourNow - currentShift.start) + 1;

    // to handle shift 3
    if(currentShift.end < currentShift.start && hourNow < currentShift.start){
        jamKe = parseInt(hourNow) + 1;
    }

    const activeBlock = (schedulePattern || []).find(v => v.block == block && v.job == job) || {};
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