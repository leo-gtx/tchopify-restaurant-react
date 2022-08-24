import {
    SET_RESTAURANT,
    UPDATE_RESTAURANT,
    SET_RESTAURANTS,
    REMOVE_RESTAURANT,
    UPDATE_BUSINESS_HOURS
} from '../actions/restaurant';


export default function restaurants(state = {}, action){
    switch (action.type) {

        case SET_RESTAURANT:
            return {
                ...state,
                [action.payload.id]: action.payload
            }

        case UPDATE_RESTAURANT:
            return {
                ...state,
                [action.payload.id]: {
                    ...state[action.payload.id],
                    ...action.payload
                }
            }

        case SET_RESTAURANTS:
            return action.payload

        case REMOVE_RESTAURANT:
            delete state[action.payload]
            return state

        case UPDATE_BUSINESS_HOURS:
            return {
                ...state,
                [action.payload.restaurantId]: {
                    ...state[action.payload.restaurantId],
                    ...action.payload.businessHours
                }
            }

        default:
            return state;
    }
}