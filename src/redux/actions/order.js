import firebase from '../../firebase';
import { formattedOrders, RequestTimeout, uniqueId, isExpired} from '../../utils/utils';
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
        payment: payment.value,
        from,
        mode: 'DINE',
        billing,
        total,
        orderAt: Date.now(),
        status: 'new',
        paymentStatus: 'unpaid',
    };
    return RequestTimeout(1000 *60*1, firebase
    .firestore()
    .collection('orders')
    .doc(id)
    .set(data)
    .then(onSuccess)
    .catch(onError)
    )
    .catch(onError)

}

export function PayAndPlaceOrder({cart, subtotal, billing, payment, from, total, wallet, code}, callback, onError){
    if(code){
        return RequestTimeout(1000*60*5, firebase
            .firestore()
            .collection('cards')
            .where('code','==',code)
            .get()
            .then((snapDoc)=>{ 
                if(snapDoc.empty){
                    onError('This card does not exist!')
                }
                else{
                    const card = snapDoc.docs[0].data()
                    if(isExpired(card.expiredAt)){
                        return onError('This card is expired!');
                    }
                    const discount = total * card.rate;
                    pay({amount: total - discount, wallet, currency: 'xaf', service: payment.service})
                    .then((res)=>{
                        const id = uniqueId()
                        const data = {
                            id,
                            cart,
                            subtotal,
                            discount,
                            from,
                            mode: 'DINE',
                            billing,
                            total,
                            payment: { wallet, method: payment.value},
                            card,
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
                            // dispatch(addOrder(data))
                            callback() 
                        })
                        .catch((err)=>{
                            onError(err)
                        })
                        })
                    .catch((err)=>{onError(err)})
                }
            })
            .catch((err)=>onError(err))
        
            )
    }
    return RequestTimeout(1000*60*5,
                pay({amount: total, wallet, currency: 'xaf', service: payment.service})
                .then((res)=>{
                    const id = uniqueId()
                    const data = {
                        id,
                        cart,
                        subtotal,
                        discount:0,
                        from,
                        mode: 'DINE',
                        billing,
                        total,
                        payment: { wallet, method: payment.value},
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
                        // dispatch(addOrder(data))
                        callback() 
                    })
                    .catch((err)=>{
                        onError(err)
                    })
                    })
        )
        .catch((err)=>onError(err))
    
}

export function PayAndEditPosOrder({cart, subtotal, billing, payment, from, total, wallet, code}, callback, onError){
    if(code){
        return RequestTimeout(1000*60*5, firebase
            .firestore()
            .collection('cards')
            .where('code','==',code)
            .get()
            .then((snapDoc)=>{ 
                if(snapDoc.empty){
                    onError('This card does not exist!')
                }
                else{
                    const card = snapDoc.docs[0].data()
                    if(isExpired(card.expiredAt)){
                        return onError('This card is expired!');
                    }
                    const discount = total * card.rate;
                    pay({amount: total - discount, wallet, currency: 'xaf', service: payment.service})
                    .then((res)=>{
                        const id = uniqueId()
                        const data = {
                            id,
                            cart,
                            subtotal,
                            discount,
                            billing,
                            total,
                            payment: { wallet, method: payment.value},
                            card,
                            paymentStatus: 'paid',
                            paymentFeedback: res.data
                        };
                        firebase
                        .firestore()
                        .collection('orders')
                        .doc(id)
                        .update({
                            cart,
                            payment: data.payment,
                            paymentStatus: data.paymentStatus,
                            paymentFeedback: data.paymentFeedback,
                            card: data.card,
                            discount: data.discount,
                            total: data.total
                        })
                        .then(()=>{
                            callback() 
                        })
                        .catch((err)=>{
                            onError(err)
                        })
                        })
                    .catch((err)=>{onError(err)})
                }
            })
            .catch((err)=>onError(err))
        
            )
    }
    return RequestTimeout(1000*60*5,
                pay({amount: total, wallet, currency: 'xaf', service: payment.service})
                .then((res)=>{
                    const id = uniqueId()
                    const data = {
                        id,
                        cart,
                        subtotal,
                        discount:0,
                        from,
                        mode: 'DINE',
                        billing,
                        total,
                        payment: { wallet, method: payment.value},
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
                        // dispatch(addOrder(data))
                        callback() 
                    })
                    .catch((err)=>{
                        onError(err)
                    })
                    })
        )
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
        .orderBy('orderAt', 'desc')
        .onSnapshot((documentSnapshot)=>{
            callback(formattedOrders(documentSnapshot.docs))
        })
    }
    return firebase
        .firestore()
        .collection('orders')
        .where('from.owner', '==', ownerId)
        .where('status', '==', status)
        .orderBy('orderAt', 'desc')
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

export function PosEditOrder({id, cart}, onSuccess, onError) {
    return firebase
    .firestore()
    .collection('orders')
    .doc(id)
    .update({cart})
    .then(onSuccess)
    .catch(onError)
}