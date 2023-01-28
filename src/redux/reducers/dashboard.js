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
    monthlyIncomes: 0,
    monthlyIncomesPercentage: 0,
    monthlyIncomesChartData: [],
    incomesDoneByShop: {},
    orderByMode: { },
    yearlySalesByDelivery: {
        data: [],
        label: []
    },
    monthlySales: {
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