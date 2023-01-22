// import { handleGetCategories, handleGetSubCategories } from "./category";
import { handleGetOrderStatistics } from './dashboard';
import { handleGetDishes } from "./dishes";

import { handleGetRestaurants} from "./restaurant";
import { resetCart } from './app';

export function handleInit(owner){
    return (dispatch)=>Promise.all([
        dispatch(handleGetDishes(owner)),
        dispatch(handleGetRestaurants(owner)),
        dispatch(handleGetOrderStatistics(owner)),
    ])
    .catch((err)=>console.error(err))
}

export function handleEraseData(){
    return (dispatch)=>Promise.all([
        dispatch(resetCart()),
    ])
}