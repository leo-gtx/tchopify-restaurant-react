import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
// material
import { Container, Grid, Stack } from '@material-ui/core';
// redux
import { useSelector } from 'react-redux';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useIsMountedRef from '../../hooks/useIsMountedRef';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { OrderCaroussel } from '../../components/_dashboard/order/kitchen';
import {
  ShopProductSort,
} from '../../components/_dashboard/pos';
// actions
import { GetOrdersByStatus, GetOrdersByStatusAndShop, SetPosOrderStatus, GetPosOrdersByStatusShopAndUser } from '../../redux/actions/order';
// utils 
import { getOwnerId, isOwner, isWaitress, isAdmin, isChef } from '../../utils/utils';

// ----------------------------------------------------------------------
const OPTIONS = [
  {
    id: 1,
    name: 'day'
  },
  {
    id: 2,
    name: 'week'
  },
  {
    id: 3,
    name: 'month'
  },
  {
    id: 4,
    name: 'year'
  }
]
export default function DineOrders() {
  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const {authedUser} = useSelector((state)=>state);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [readyOrders, setReadyOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [sort, setSort] = useState('day');
  const isMountedRef = useIsMountedRef();
  useEffect(()=>{
    if(isMountedRef.current){
      if(isOwner(authedUser)){
          GetOrdersByStatus(
            {ownerId: getOwnerId(authedUser), status: 'new', mode: 'DINE'},
            (data)=>{
              const orders = Object.values(data)
              setPendingOrders(orders.filter((item)=>moment(item.orderAt).isSame(new Date(), sort)))
            })
          GetOrdersByStatus(
            {ownerId: getOwnerId(authedUser), status: 'ready', mode: 'DINE'},
            (data)=>{
              const orders = Object.values(data)
              setReadyOrders(orders.filter((item)=>moment(item.orderAt).isSame(new Date(), sort)))
            })
          GetOrdersByStatus(
            {ownerId: getOwnerId(authedUser), status: 'completed', mode: 'DINE'},
            (data)=>{
              const orders = Object.values(data)
              setDeliveredOrders(orders.filter((item)=>moment(item.orderAt).isSame(new Date(), sort)))
            })
      }
      if(isAdmin(authedUser) || isChef(authedUser)){
          GetOrdersByStatusAndShop(
            { status: 'new', shopId: authedUser.shop, mode: 'DINE'},
            (data)=>{
              const orders = Object.values(data)
              setPendingOrders(orders.filter((item)=>moment(item.orderAt).isSame(new Date(), sort)))
            })
          GetOrdersByStatusAndShop(
            { status: 'ready', shopId: authedUser.shop, mode: 'DINE'},
            (data)=>{
              const orders = Object.values(data)
              setReadyOrders(orders.filter((item)=>moment(item.orderAt).isSame(new Date(), sort)))
            })
          GetOrdersByStatusAndShop(
            { status: 'completed', shopId: authedUser.shop, mode: 'DINE'},
            (data)=>{
              const orders = Object.values(data)
              setDeliveredOrders(orders.filter((item)=>moment(item.orderAt).isSame(new Date(), sort)))
            })
      }
      if(isWaitress(authedUser)){
          GetPosOrdersByStatusShopAndUser(
            { status: 'new', shopId: authedUser.shop, mode: 'DINE', userId: authedUser.id},
            (data)=>{
              const orders = Object.values(data)
              setPendingOrders(orders.filter((item)=>moment(item.orderAt).isSame(new Date(), sort)))
            })
          GetPosOrdersByStatusShopAndUser(
            { status: 'ready', shopId: authedUser.shop, mode: 'DINE', userId: authedUser.id},
            (data)=>{
              const orders = Object.values(data)
              setReadyOrders(orders.filter((item)=>moment(item.orderAt).isSame(new Date(), sort)))
            })
          GetPosOrdersByStatusShopAndUser(
            { status: 'completed', shopId: authedUser.shop, mode: 'DINE', userId: authedUser.id},
            (data)=>{
              const orders = Object.values(data)
              setDeliveredOrders(orders.filter((item)=>moment(item.orderAt).isSame(new Date(), sort)))
            })
      }
    }
    return ()=>{
      isMountedRef.current = false;
    }
  },[setPendingOrders,  setReadyOrders, setDeliveredOrders, sort, authedUser, isMountedRef])

  const handleReadyOrder = useCallback((orderId)=>{
    SetPosOrderStatus({status: 'ready', readyDate: Date.now()}, orderId)
  },[])
  const handleCompleteOrder = useCallback((orderId)=>{
    SetPosOrderStatus({status: 'completed', completedDate: Date.now(), paymentStatus: 'paid'}, orderId)
  },[])
  const handleSelectOption = (value)=>setSort(value)
  return (
    <Page title="Pos Orders | Tchopify">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={t('allOrders.dineTitle')}
          links={[
            { name: t('links.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('links.dineOrders'), href: PATH_DASHBOARD.order.all },
          ]}
        />
            <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
              <ShopProductSort options={OPTIONS} onSelectOption={handleSelectOption} currentOption={sort} />
             </Stack> 
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <OrderCaroussel
                     title={t('allOrders.titleKitchen')}
                     data={pendingOrders} 
                     action1={{onAction: handleReadyOrder, title: t('actions.ready'), visible: true}} 
                     action2={{ visible: false}} 
                     />
                </Grid>
                <Grid item xs={12} md={4}>
                    <OrderCaroussel 
                    title={t('allOrders.titleServe')}
                    data={readyOrders}
                    action1={{onAction: handleCompleteOrder, title: t('actions.completed'), visible: true}} 
                     action2={{ visible: false}} 
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <OrderCaroussel 
                    title={t('allOrders.titleCompleted')}
                    data={deliveredOrders}
                    action1={{visible:false}}
                    action2={{visible: false}}
                    />
                </Grid>
            </Grid>
      </Container>
    </Page>
  );
}
