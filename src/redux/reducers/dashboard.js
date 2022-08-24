import {
 SET_STATISTICS
} from '../actions/dashboard';


const initialState = {
    orderDone: 0,
    orderDoneChartData: [],
    orderDonePercentage: 0,
    incomes: 0,
    incomesPercentage: 0,
    incomesChartData: [],
    posIncomes: 0,
    posIncomesPercentage: 0,
    posIncomesChartData: [],
    incomesDoneByShop: {},
    orderByMode: { },
    yearlySalesByDelivery: {
        data: [],
        label: []
    },
    yearlySalesByDine: {
        data: [],
        label: []
    },
    mostOrdered: []
};
export default function dashboard(state = initialState, action ){
    switch (action.type) {
        case SET_STATISTICS:
            return action.payload;
    
        default:
            return state;
    }
}