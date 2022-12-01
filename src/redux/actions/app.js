export const SET_CURRENT_RESTAURANT = 'SET_CURRENT_RESTAURANT';
export const ADD_CART = 'ADD_CART';
export const DELETE_CART = 'DELETE_CART';
export const APPLY_DISCOUNT =  'APPLY_DISCOUNT';
export const DECREASE_QUANTITY = 'DECREASE_QUANTITY';
export const INCREASE_QUANTITY = 'INCREASE_QUANTITY';
export const RESET_CART = 'RESET_CART';
export const APPLY_SHIPPING = 'APPLY_SHIPPING';
export const SET_SHOP_CHECKOUT = 'SET_SHOP_CHECKOUT';
export const GET_CART = 'GET_CART';
export const SET_ORDER_ID = 'SET_ORDER_ID';
export const SET_BILLING = 'SET_BILLING';
export const SET_FROM = 'SET_FROM';
export const SET_PAYMENT = 'SET_PAYMENT';
export const SET_PAYMENT_STATUS = 'SET_PAYMENT_STATUS';

export function setPayment(value) {
    return {
        type: SET_PAYMENT,
        payload: value
    }
}

export function setPaymentStatus(value) {
    return {
        type: SET_PAYMENT_STATUS,
        payload: value
    }
}

export function setFrom(value) {
    return {
        type: SET_FROM,
        payload: value
    }
}

export function setBilling(value){
    return {
        type: SET_BILLING,
        payload: value
    }
}


export function setOrderId(value) {
    return {
        type: SET_ORDER_ID,
        payload: value
    }
}

export function setShopCheckout(value){
    return {
        type: SET_SHOP_CHECKOUT,
        payload: value
    }
}

export function setCurrentRestaurant(restaurantId){
    return {
        type: SET_CURRENT_RESTAURANT,
        payload: restaurantId
    }
}

export function addCart(value){
    return {
        type: ADD_CART,     
        payload: value
    }
}


export function getCart(cart){
    return {
        type: GET_CART,
        payload: cart
    }
}


export function deleteCart(id, options){
    return {
        type: DELETE_CART,
        payload: { id, options}
    }
}

export function applyDiscount(value){
    return {
        type: APPLY_DISCOUNT,
        payload: value
    }
}

export function decreaseQuantity(id, options){
    return {
        type: DECREASE_QUANTITY,
        payload: {id, options}
    }
}

export function increaseQuantity(id, options){
    return {
        type: INCREASE_QUANTITY,
        payload: {id, options}
    }
}

export function resetCart(){
    return {
        type: RESET_CART,
    }
}

export function applyShipping(value){
    return {
        type: APPLY_SHIPPING,
        payload: value
    }
}

export function handleSetShopAndCart(shop, product){
    return (dispatch) => {
        dispatch(setShopCheckout(shop))
        dispatch(addCart(product))
    }
}
