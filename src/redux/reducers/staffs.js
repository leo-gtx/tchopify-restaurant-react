import {
    SET_STAFFS,
    REMOVE_STAFF,
    UPDATE_STAFF,
} from '../actions/staffs';


export default function staffs(state = {}, action){
    switch (action.type) {
        case SET_STAFFS:
            return action.payload;

        case REMOVE_STAFF:
            delete state[action.payload];
            return state;
            
        case UPDATE_STAFF:
            return {
                ...state,
                [action.payload.id]: {
                    ...state[action.payload.id],
                    ...action.payload,
                },
            };
        default:
            return state;
    }
}