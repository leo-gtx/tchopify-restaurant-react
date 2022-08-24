import { sum, filter, map, uniqBy, isEqual, uniqWith } from 'lodash';
import {
    SET_CURRENT_RESTAURANT,
    ADD_CART,
    GET_CART,
    DELETE_CART,
    APPLY_DISCOUNT,
    DECREASE_QUANTITY,
    INCREASE_QUANTITY,
    RESET_CART,
    SET_SHOP_CHECKOUT,
} from '../actions/app';

const initialState = {
    checkout: {
        from: '',
        cart: [],
        step: 0,
        billing: null,
        shipping: 0,
        deliveryCost: 0,
        deliveryTime: 0, 
        discount: 0,
        subtotal: 0,
        total: 0,
    },
}

export default function app(state = initialState, action){
    switch (action.type) {
        case SET_CURRENT_RESTAURANT:
            return {
                ...state,
                currentRestaurant: action.payload
            }
        case SET_SHOP_CHECKOUT:
            return {
                ...state,
                checkout: {
                    ...state.checkout,
                    from: action.payload
                }
            }
        case ADD_CART: {
            const product = action.payload;
            const isEmptyCart = state.checkout.cart.length === 0;

            if (isEmptyCart) {
                return {
                    ...state,
                    checkout: {
                        ...state.checkout,
                        cart: uniqBy([product, product], 'id'),
                    }
                }
            }
            return {
                ...state,
                checkout: {
                    ...state.checkout,
                    cart: uniqWith([...map(state.checkout.cart, (_product) => {
                        const isExisted = (_product.id === product.id) && isEqual(_product.options, product.options)
                        if (isExisted) {
                            return {
                            ..._product,
                            subtotal: _product.price * (_product.quantity + 1),
                            quantity: _product.quantity + 1
                            };
                        }
                        return _product;
                        }), product], (a,b)=> a.id === b.id && isEqual(a.options, b.options) ),
                }
            }
                
            
        }
            
        case DELETE_CART: 
            return {
                ...state,
                checkout: {
                    ...state.checkout,
                    cart: filter(state.checkout.cart, (item) => item.id !== action.payload.id || (item.id === action.payload.id && !isEqual(item.options,  action.payload.options))),
                }
            }
       
        case GET_CART: {
            const cart = action.payload;
            const subtotal = sum(cart.map((product) => product.price * product.quantity));
            const discount = cart.length === 0 ? 0 : state.checkout.discount;
            const shipping = cart.length === 0 ? 0 : state.checkout.shipping;
            const billing = cart.length === 0 ? null : state.checkout.billing;
            return {
                ...state,
                checkout: {
                    ...state.checkout,
                    cart,
                    discount,
                    shipping,
                    billing,
                    subtotal,
                    total: subtotal - discount,
                }
            }
        }
    
        case APPLY_DISCOUNT: 
            return {
                ...state,
                checkout: {
                    ...state.checkout,
                    discount: action.payload,
                    total: state.checkout.total - action.payload
                }
            }
        case DECREASE_QUANTITY: {
            const {id, options} = action.payload;
            const updateCart = map(state.checkout.cart, (product) => {
                if (product.id === id && isEqual(product.options, options)) {
                return {
                    ...product,
                    subtotal: product.price * (product.quantity - 1),
                    quantity: product.quantity - 1
                };
                }
                return product;
            });
            return {
                ...state,
                checkout: {
                    ...state.checkout,
                    cart: updateCart
                }
            }
        }
        case INCREASE_QUANTITY: {
            const {id, options} = action.payload;
            const updateCart = map(state.checkout.cart, (product) => {
                if (product.id === id && isEqual(product.options, options)) {
                return {
                    ...product,
                    subtotal: product.price * (product.quantity + 1),
                    quantity: product.quantity + 1
                };
                }
                return product;
            });
            return {
                ...state,
                checkout: {
                    ...state.checkout,
                    cart: updateCart
                }
            }
        }
        case RESET_CART:
            return {
                ...state,
                checkout:{
                    cart: [],
                    step: 0,
                    billing: null,
                    shipping: 0,
                    discount: 0,
                    subtotal: 0,
                    total: 0,
                }
            }
        default:
            return state;
    }
}