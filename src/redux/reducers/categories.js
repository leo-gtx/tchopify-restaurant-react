import {
    SET_CATEGORIES,
    ADD_CATEGORY,
    DELETE_CATEGORY,
    SET_SUBCATEGORIES,
    ADD_SUBCATEGORY,
    DELETE_SUBCATEGORY,
    EDIT_CATEGORY,
    EDIT_SUBCATEGORY
} from '../actions/category';

const initialState = {
    meta: {},
    sub: {}
}
export default function categories(state = initialState, action){
    switch (action.type) {
        case SET_CATEGORIES:
            state.meta = action.payload
            return state
        case ADD_CATEGORY:
            state.meta = {
                ...state.meta,
                [action.payload.id]: action.payload
            }
            return state
        case DELETE_CATEGORY:
            delete state.meta[action.payload]
            return state
        case EDIT_CATEGORY:
            state.meta[action.payload.id] = {
                ...state.meta[action.payload.id],
                ...action.payload,
            }
            return state
        case EDIT_SUBCATEGORY:
            state.sub[action.payload.id] = {
                ...state.sub[action.payload.id],
                ...action.payload
            }
            return state
        case SET_SUBCATEGORIES:
            state.sub = action.payload
            return state
        case DELETE_SUBCATEGORY:
            delete state.sub[action.payload]
            return state
        case ADD_SUBCATEGORY:
            state.sub = {
                ...state.sub,
                [action.payload.id]: action.payload
            }
            return state
        default:
            return state;
    }
}