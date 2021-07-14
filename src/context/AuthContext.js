import createDataContext from "./createDataContext";
import easymoveinApi from "../api/easymovein";

const authReducer = (state, action) => {
    switch (action.type) {
        default:
            return state;
    }
};

const signin = (dispatch) => {
    return async ({ email, password }) => {
        try {
            console.log(email, password);
            const response = await easymoveinApi.post('/login.php', { email, password });
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };
};

const signout = (dispatch) => {
    return async () => {

    };
};

export const { Provider, Context} = createDataContext(
    authReducer,
    { signin, signout },
    { isSignedIn: false }
)