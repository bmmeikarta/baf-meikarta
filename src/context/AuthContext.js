import createDataContext from "./createDataContext";
import easymoveinApi from "../api/easymovein";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from "../navigationRef";

const authReducer = (state, action) => {
    switch (action.type) {
        case 'AUTH_CLEAR_ERROR':
            return { ...state, errorMessage: '' };
        case 'AUTH_ERROR':
            return { ...state, errorMessage: action.payload };
        case 'AUTH_SIGNIN':
            return { errorMessage: '', token: action.payload };
        case 'AUTH_SIGNOUT':
            return { token: null, errorMessage: '' };
        default:
            return state;
    }
};

const tryLocalSignin = dispatch => async () => {
    const token = await AsyncStorage.getItem('token');
    if(token){
        dispatch({ type: 'AUTH_SIGNIN', payload: token });
        navigate('Home');
    } else {
        navigate('Signin');
    }
    
}

const clearError = (dispatch) => () => {
    dispatch({ type: 'AUTH_CLEAR_ERROR' });
}

const signin = (dispatch) => async ({ email, password }, callback) => {
    try {
        clearError();
        const response = await easymoveinApi.post('/login.php', { email, password });
        if(!response.data.status) throw new Error(response.data.message);

        await AsyncStorage.setItem('token', response.data.token);
        dispatch({ type: 'AUTH_SIGNIN', payload: response.data.token});
        
        // navigate to main flow -> App.js
        navigate('Home');
    } catch (error) {
        // console.log(error)
        dispatch({ type: 'AUTH_ERROR', payload: error.message});
    }
};

const signout = (dispatch) => async () => {
    await AsyncStorage.removeItem('token');
    dispatch({ type: 'AUTH_SIGNOUT' });
    navigate('loginFlow');
};

export const { Provider, Context} = createDataContext(
    authReducer,
    { signin, signout, clearError, tryLocalSignin },
    { token: null, errorMessage: '' }
)