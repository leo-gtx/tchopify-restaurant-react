import {v4 as uuidv4} from 'uuid';
import firebase from '../../firebase';
import { formattedOrders, RequestTimeout, uniqueId} from '../../utils/utils';
import { pay } from '../../utils/api';

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

function addOrder(order){
    return {
        type: ADD_ORDER,
        payload: order
    }
}


function setOrders(orders){
    return {
        type: SET_ORDERS,
        payload: orders
    }
}

export function handlePlaceOrder({cart, subtotal, discount, billing, shipping, payment, from, total, deliveryTime}, callback, onError){
    const id = uniqueId()
    const data = {
        id,
        cart,
        subtotal,
        discount,
        shipping,
        payment,
        from,
        billing,
        total,
        deliveryTime,
        orderAt: Date.now(),
        status: 'new',
        paymentStatus: 'unpaid',
    };
    return (dispatch) => firebase
    .firestore()
    .collection('orders')
    .doc(id)
    .set(data)
    .then(()=>{
        dispatch(addOrder(data))
        callback()
    })
    .catch((err)=>{
        onError(err)
    })
}

export function PosPlaceOrder({cart, subtotal, billing, discount, payment, from,  total}, onSuccess, onError){
    const id = uniqueId()
    const data = {
        id,
        cart,
        subtotal,
        discount,
        payment,
        from,
        mode: 'DINE',
        billing,
        total,
        orderAt: Date.now(),
        status: 'new',
        paymentStatus: 'unpaid',
    };
    return firebase
    .firestore()
    .collection('orders')
    .doc(id)
    .set(data)
    .then(onSuccess)
    .catch(onError)
}

export function handlePayAndPlaceOrder({cart, subtotal, discount, billing, shipping, payment, from, total, wallet, service, deliveryTime, coupon}, callback, onError){
    return (dispatch) => RequestTimeout(1000*60*5, pay({amount: total, wallet, currency: 'xaf', service})
    .then((res)=>{
        const id = uuidv4()
        const data = {
            id,
            cart,
            subtotal,
            discount,
            shipping,
            payment,
            from,
            billing,
            total,
            deliveryTime,
            orderAt: Date.now(),
            status: 'new',
            paymentStatus: 'paid',
            paymentFeedback: res.data
        };
        firebase
        .firestore()
        .collection('orders')
        .doc(id)
        .set(data)
        .then(()=>{
            if(coupon){
               firebase
                .firestore()
                .collection('coupons')
                .doc(coupon.id)
                .update({remainUse: coupon.remainUse -1, blacklisted:[...coupon.blacklisted, billing.userId]}) 
                .then(()=>{
                    dispatch(addOrder(data))
                    callback()
                })
            }else{
                dispatch(addOrder(data))
                callback()
            }
            
            
        })
        .catch((err)=>{
            onError(err)
        })
    })
    .catch((err)=>{
        onError(err)
    }))
    .catch((err)=>onError(err))

    
}

/* export function handlePayAndMarkAsDelivered({total, wallet, service, orderId, owner}, callback, onError){
    return (dispatch) => pay({amount: total, wallet, currency: 'xaf', service})
    .then((res)=>{
        const data = {
            id: orderId,
            status: 'completed',
            paymentStatus: 'paid',
            paymentFeedback: res.data
        };
        firebase
        .firestore()
        .collection('orders')
        .doc(orderId)
        .update(data)
        .then(()=>{
            firebase
            .firestore()
            .collection('users')
            .doc(owner)
            .get()
            .then((snapDoc)=>{
                if(snapDoc.exists){
                    firebase
                    .firestore()
                    .collection('users')
                    .doc(owner)
                    .update({balance: snapDoc.data().balance + total})
                }
                dispatch(addOrder(data))
                callback()
            })
        })
        .catch((err)=>{
            onError(err)
        })
    })
    .catch((err)=>{
        onError(err)
    })

    
} */

export function handleMarkAsDelivered({total, orderId, owner}, callback, onError){
    return firebase
        .firestore()
        .collection('orders')
        .doc(orderId)
        .update({status: 'completed', completedDate: Date.now()})
        .then(()=>{
            firebase
            .firestore()
            .collection('users')
            .doc(owner)
            .get()
            .then((snapDoc)=>{
                if(snapDoc.exists){
                    firebase
                    .firestore()
                    .collection('users')
                    .doc(owner)
                    .update({balance: snapDoc.data().balance + total})
                }
                callback()
            })
        })
        .catch((err)=>{
            onError(err)
        })
}

export function handleRateOrder({orderId, rating}, onSuccess, onError){
    return firebase
    .firestore()
    .collection('orders')
    .doc(orderId)
    .update({rating})
    .then(onSuccess)
    .catch(onError)
}

export function handleGetOrders(userId){
    return (dispatch) => firebase
    .firestore()
    .collection('orders')
    .where('billing.userId', '==', userId)
    .onSnapshot((documentSnapshot)=>{
        if(!documentSnapshot.empty) dispatch(setOrders(formattedOrders(documentSnapshot.docs)))
    })
}

export function GetOrdersByOwner(ownerId,callback){
    return firebase
    .firestore()
    .collection('orders')
    .where('from.owner', '==', ownerId)
    .get()
    .then((documentSnapshot)=>{
        callback(formattedOrders(documentSnapshot.docs))
    })
}
export function GetOrdersByStatus({status, ownerId, mode},callback){
    if(mode){
        return firebase
        .firestore()
        .collection('orders')
        .where('from.owner', '==', ownerId)
        .where('status', '==', status)
        .where('mode', '==', mode)
        .orderBy('orderAt', 'asc')
        .onSnapshot((documentSnapshot)=>{
            callback(formattedOrders(documentSnapshot.docs))
        })
    }
    return firebase
        .firestore()
        .collection('orders')
        .where('from.owner', '==', ownerId)
        .where('status', '==', status)
        .orderBy('orderAt', 'asc')
        .onSnapshot((documentSnapshot)=>{
            callback(formattedOrders(documentSnapshot.docs))
        })
    
}

export function GetOrdersByStatusAndShop({status, shopId, mode},callback){
    if(mode){
        return firebase
        .firestore()
        .collection('orders')
        .where('from.id', '==', shopId)
        .where('status', '==', status)
        .where('mode', '==', mode)
        .orderBy('orderAt', 'asc')
        .onSnapshot((documentSnapshot)=>{
                callback(formattedOrders(documentSnapshot.docs))
        })
    }
    return firebase
        .firestore()
        .collection('orders')
        .where('from.id', '==', shopId)
        .where('status', '==', status)
        .orderBy('orderAt', 'asc')
        .onSnapshot((documentSnapshot)=>{
                callback(formattedOrders(documentSnapshot.docs))
        })
    
}

export function GetPosOrdersByStatusShopAndUser({status, shopId, mode, userId},callback){
    return firebase
    .firestore()
    .collection('orders')
    .where('from.id', '==', shopId)
    .where('from.userId', '==', userId)
    .where('status', '==', status)
    .where('mode', '==', mode)
    .orderBy('orderAt', 'asc')
    .onSnapshot((documentSnapshot)=>{
            callback(formattedOrders(documentSnapshot.docs))
    })
}

export function SetOrderStatus({status, orderId}){
    return firebase
    .firestore()
    .collection('orders')
    .doc(orderId)
    .update({status, [`${status}Date`]: Date.now() })
    .catch((err)=>console.error(err))
}

export function SetPosOrderStatus(data, orderId){
    return firebase
    .firestore()
    .collection('orders')
    .doc(orderId)
    .update({...data})
    .catch((err)=>console.error(err))
}


export function GetOrder(orderId,callback){
    return firebase
    .firestore()
    .collection('orders')
    .doc(orderId)
    .onSnapshot((documentSnapshot)=>{
        if(documentSnapshot.exists) callback(documentSnapshot.data())
    })
}

export function getCoupon({code, uid}, onSuccess, onError){
    return firebase
    .firestore()
    .collection('coupons')
    .where('code', '==', code)
    .where('isExpired', '==', false)
    .where('remainUse', '>', 0)
    .get()
    .then((snapDoc)=>{
        
        if(!snapDoc.empty){
            const coupon = snapDoc.docs[0].data()
            if(coupon.blacklisted.includes(uid)){
                onError()
            }else{
                onSuccess(coupon)
            }
            
        }else{
            onError()
        }

    })
    .catch((err)=>{
        console.error(err)
        onError()
    })
}