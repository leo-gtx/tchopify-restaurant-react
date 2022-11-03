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
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { OrderCaroussel } from '../../components/_dashboard/order/kitchen';
import {
  ShopProductSort,
} from '../../components/_dashboard/pos';
// actions
import { GetOrdersByStatus, GetOrdersByStatusAndShop, SetOrderStatus } from '../../redux/actions/order';
// utils 
import { getOwnerId, isOwner } from '../../utils/utils';

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
export default function TakeawayOrders() {
  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const {authedUser} = useSelector((state)=>state);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [readyOrders, setReadyOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [sort, setSort] = useState('day')
  useEffect(()=>{
    if(isOwner(authedUser)){
        GetOrdersByStatus(
          {ownerId: getOwnerId(authedUser), status: 'new', mode: 'TAKEAWAY'},
           (data)=>{
            const orders = Object.values(data)
            setPendingOrders(orders.filter((item)=>moment(item.orderAt).isSame(new Date(), sort)))
          })
        GetOrdersByStatus(
          {ownerId: getOwnerId(authedUser), status: 'accepted', mode: 'TAKEAWAY'},
          (data)=>{
            const orders = Object.values(data)
            setAcceptedOrders(orders.filter((item)=>moment(item.orderAt).isSame(new Date(), sort)))
          })
        GetOrdersByStatus(
          {ownerId: getOwnerId(authedUser), status: 'ready', mode: 'TAKEAWAY'},
          (data)=>{
            const orders = Object.values(data)
            setReadyOrders(orders.filter((item)=>moment(item.orderAt).isSame(new Date(), sort)))
          })
        GetOrdersByStatus(
          {ownerId: getOwnerId(authedUser), status: 'completed', mode: 'TAKEAWAY'},
          (data)=>{
            const orders = Object.values(data)
            setDeliveredOrders(orders.filter((item)=>moment(item.orderAt).isSame(new Date(), sort)))
          })
    }else{
        GetOrdersByStatusAndShop(
          { status: 'new', shopId: authedUser.shop, mode: 'TAKEAWAY'},
          (data)=>{
            const orders = Object.values(data)
            setPendingOrders(orders.filter((item)=>moment(item.orderAt).isSame(new Date(), sort)))
          })
        GetOrdersByStatusAndShop(
          { status: 'accepted', shopId: authedUser.shop, mode: 'TAKEAWAY'},
          (data)=>{
            const orders = Object.values(data)
            setAcceptedOrders(orders.filter((item)=>moment(item.orderAt).isSame(new Date(), sort)))
          })
        GetOrdersByStatusAndShop(
          { status: 'ready', shopId: authedUser.shop, mode: 'TAKEAWAY'},
          (data)=>{
            const orders = Object.values(data)
            setReadyOrders(orders.filter((item)=>moment(item.orderAt).isSame(new Date(), sort)))
          })
        GetOrdersByStatusAndShop(
          { status: 'completed', shopId: authedUser.shop, mode: 'TAKEAWAY'},
          (data)=>{
            const orders = Object.values(data)
            setDeliveredOrders(orders.filter((item)=>moment(item.orderAt).isSame(new Date(), sort)))
          })
    }
    return null;
  },[setPendingOrders, setAcceptedOrders, setReadyOrders, setDeliveredOrders, sort, authedUser])

  const handleAcceptOrder = useCallback((orderId)=>{
    SetOrderStatus({status: 'accepted', orderId})
  },[])
  const handleRejectOrder = useCallback((orderId)=>{
    SetOrderStatus({status: 'rejected', orderId})
  },[])
  const handleReadyOrder = useCallback((orderId)=>{
    SetOrderStatus({status: 'ready', orderId})
  },[])
  const handleSelectOption = (value)=>setSort(value)
  return (
    <Page title="Take Away Orders | Tchopify">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={t('allOrders.takeawayTitle')}
          links={[
            { name: t('links.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('links.takeawayOrders'), href: PATH_DASHBOARD.order.all },
          ]}
        />
            <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
              <ShopProductSort options={OPTIONS} onSelectOption={handleSelectOption} currentOption={sort} />
             </Stack> 
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <OrderCaroussel
                     title={t('allOrders.titleNew')}
                     data={pendingOrders} 
                     action1={{onAction: handleAcceptOrder, title: t('actions.accept'), visible: true}} 
                     action2={{ onAction: handleRejectOrder, title: t('actions.reject'), visible: true}} 
                     />
                </Grid>
                <Grid item xs={12} md={4}>
                    <OrderCaroussel 
                    title={t('allOrders.titleAccepted')}
                    data={acceptedOrders}
                    action1={{onAction: handleReadyOrder, title: t('actions.ready'), visible: true}} 
                    action2={{ visible: false}}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <OrderCaroussel 
                    title={t('allOrders.titleReady')}
                    data={readyOrders}
                    action1={{ visible: false}} 
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
