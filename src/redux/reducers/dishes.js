import {
    ADD_DISH,
    SET_DISHES,
    REMOVE_DISH,
    UPDATE_DISH,
} from '../actions/dishes';


export default function dishes(state = {}, action){
    switch (action.type) {
        case ADD_DISH:
            return {
                ...state,
                ...action.payload,
            };

        case SET_DISHES: 
            return action.payload;

        case REMOVE_DISH:
            delete state[action.payload];
            return state;
        
        case UPDATE_DISH:
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