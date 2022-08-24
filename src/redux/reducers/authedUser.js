import {
    SET_AUTHED_USER,
    REMOVE_AUTHED_USER,
    UPDATE_AUTHED_USER,
} from '../actions/authedUser';


const initialState = {
    isAuthenticated: false,
    balance: 0,
    rewards: 0,
}
export default function authedUser(state = initialState, action){
    switch (action.type) {
        case SET_AUTHED_USER:
            return {
                ...state, 
                ...action.payload
            };
        case REMOVE_AUTHED_USER:
            return initialState;
        case UPDATE_AUTHED_USER:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
}