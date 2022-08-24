import moment from 'moment';
import { sumBy, groupBy, mapValues, toArray, countBy, concat, orderBy } from 'lodash';
import firebase from '../../firebase';
import { formattedOrders } from '../../utils/utils';


export const  SET_STATISTICS = 'SET_STATISTICS';
function setStatistics(value){
    return {
        type: SET_STATISTICS,
        payload: value
    }
}

export function  handleGetOrderStatistics(ownerId){
    return (dispatch) => firebase
    .firestore()
    .collection('orders')
    .where('from.owner', '==', ownerId)
    .orderBy('orderAt', 'asc')
    .get()
    .then((SnapDoc)=>{
        const orders = Object.values(formattedOrders(SnapDoc.docs));
        const statistics = {};
        const currentDate = new Date();
        const ordersDoneDine = orders.filter((item)=> item.status === 'completed' && item.mode === 'DINE');
        const ordersDoneDelivery = orders.filter((item)=> item.status === 'completed' && item.mode === 'DELIVERY');
        const ordersPaid = orders.filter((item)=>item.status === 'completed' && item.paymentStatus === 'paid');
        const ordersMarketplaceIncomes = orders.filter((item)=>item.status === 'completed' && item.paymentStatus === 'paid' && ['DELIVERY','PICKUP'].includes(item.mode));
        const ordersPosIncomes = orders.filter((item)=> item.status === 'completed' && item.mode === 'DINE');
        // order done
        const orderDoneThisMonth = orders.filter((item)=> moment(new Date(item.orderAt)).isSame(currentDate, 'month')).length;
        statistics.orderDone = orders.length;
        statistics.orderDonePercentage = (orderDoneThisMonth - orders.filter((item)=> moment(new Date(item.orderAt)).isSame(moment(currentDate).subtract(1,'month'), 'month')).length) / orderDoneThisMonth * 100;
        statistics.orderDoneChartData = toArray(mapValues(groupBy(orders, (item)=>moment(item.orderAt).format('YYYY-MM')) , items=> items.length)).slice(0,9)
        // Marketplace incomes
        const incomesMadeThisMonth = sumBy(ordersMarketplaceIncomes.filter((item)=>moment(new Date(item.orderAt)).isSame(currentDate, 'month')), (item)=>item.total + item.discount);
        statistics.incomes = sumBy(ordersMarketplaceIncomes, (item)=>item.total + item.discount);
        statistics.incomesPercentage = (incomesMadeThisMonth - sumBy(ordersMarketplaceIncomes.filter((item)=> moment(new Date(item.orderAt)).isSame(moment(currentDate).subtract(1,'month'), 'month')), (item)=>item.total + item.discount)) / incomesMadeThisMonth * 100;
        statistics.incomesChartData = toArray(mapValues(groupBy(ordersMarketplaceIncomes, (item)=>moment(item.orderAt).format('YYYY-MM')) , items=> sumBy(items, (item)=>item.total + item.discount))).slice(0,9)
        // POS incomes
        statistics.posIncomes = sumBy(ordersPosIncomes, (item)=>item.total + item.discount);
        statistics.posIncomesPercentage = (statistics.posIncomes - sumBy(ordersPosIncomes.filter((item)=> moment(new Date(item.orderAt)).isSame(moment(currentDate).subtract(1,'month'), 'month')), (item)=>item.total + item.discount)) / statistics.posIncomes * 100;
        statistics.posIncomesChartData = toArray(mapValues(groupBy(ordersPosIncomes, (item)=>moment(item.orderAt).format('YYYY-MM')) , items=> sumBy(items, (item)=>item.total + item.discount))).slice(0,9);
        // Sales By Shop
        statistics.incomesDoneByShop = mapValues(groupBy(ordersPaid, (item)=> item.from.name) , items=> sumBy(items, (item)=>item.total + item.discount))
        // Order By Mode
        statistics.orderByMode = mapValues(groupBy(orders, (item)=>item.mode), items=> items.length)
        // Yearly Sales
        let yearlySalesLabel = mapValues(groupBy(ordersDoneDelivery, (item)=> moment(new Date(item.orderAt)).format('YYYY-MMM')), items=> moment(items[0].orderAt).format('MMM'));
        let yearlySalesData = mapValues(groupBy(ordersDoneDelivery, (item)=> moment(new Date(item.orderAt)).format('YYYY-MMM')), items=> sumBy(items, (item)=>item.total + item.discount));
        statistics.yearlySalesByDelivery = {
            data: groupBy(Object.keys(yearlySalesData).map((key)=>({[key]: yearlySalesData[key]})), (item)=> moment(Object.keys(item)[0], 'YYYY-MMM').format('YYYY')),
            label: groupBy(Object.keys(yearlySalesLabel).map((key)=>({[key]: yearlySalesLabel[key]})), (item)=> moment(Object.keys(item)[0], 'YYYY-MMM').format('YYYY'))
        };

        yearlySalesLabel = mapValues(groupBy(ordersDoneDine, (item)=> moment(new Date(item.orderAt)).format('YYYY-MMM')), items=> moment(items[0].orderAt).format('MMM'));
        yearlySalesData = mapValues(groupBy(ordersDoneDine, (item)=> moment(new Date(item.orderAt)).format('YYYY-MMM')), items=> sumBy(items, (item)=>item.total + item.discount));
        statistics.yearlySalesByDine = {
            data: groupBy(Object.keys(yearlySalesData).map((key)=>({[key]: yearlySalesData[key]})), (item)=> moment(Object.keys(item)[0], 'YYYY-MMM').format('YYYY')),
            label: groupBy(Object.keys(yearlySalesLabel).map((key)=>({[key]: yearlySalesLabel[key]})), (item)=> moment(Object.keys(item)[0], 'YYYY-MMM').format('YYYY'))
        }
        // most ordered product
        let mergedOrders = [];
        orders.forEach((item)=>{ mergedOrders =  concat(mergedOrders, item.cart)});
        mergedOrders = countBy(mergedOrders, (item)=>item.id);
        statistics.mostOrdered = orderBy(Object.keys(mergedOrders).map((key)=>({ count: mergedOrders[key], id: key })), 'count', 'desc').slice(0,4);
        
        dispatch(setStatistics(statistics));
    })
}