import createDataContext from "./createDataContext";

const reportReducer = (state, action) => {
    switch (action.type) {
        case 'REPORT_SET_LIST_ITEM':
            return { ...state, listReportItem: action.payload }
        default:
            return state;
    }
};

const addReportItem = dispatch => async(data) => {
    console.log('ADD', data);
    dispatch({ type: 'REPORT_SET_LIST_ITEM', payload: data });
};

export const { Provider, Context} = createDataContext(
    reportReducer,
    { addReportItem },

    // default state reduce
    { listReportItem: [] }
)