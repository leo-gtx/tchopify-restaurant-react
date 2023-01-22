import { useEffect } from 'react';
// material
import { Container, Grid, Skeleton} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
// hooks
import useSettings from '../../hooks/useSettings';
// actions
import { handleInit } from '../../redux/actions/shared';
// components
import Page from '../../components/Page';
import {
  Welcome,
  OrderByMode,
  MarketplaceIncomes,
  DeliveryYearlySales,
  DineYearlySales,
  Balance,
  TotalOrders,
  MostOrdered,
  ShopSalesOverview,
  MonthlyIncomes
//  InviteFriends
} from '../../components/_dashboard/general-ecommerce';
// utils
import { getOwnerId } from '../../utils/utils';

// ----------------------------------------------------------------------
const SkeletonLoader = () => {
  const { themeStretch } = useSettings();
  return(
    <Page title="General: Dashboard | Tchopify">
      <Container maxWidth={themeStretch ? false : 'xl'}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Skeleton variant='rectangular'  />
            </Grid>

            <Grid item xs={12} md={4}>
            <Skeleton variant='rectangular'  />
            </Grid>

            <Grid item xs={12} md={4}>
            <Skeleton variant='rectangular'  />
            </Grid>
            <Grid item xs={12} md={4}>
            <Skeleton variant='rectangular'  />
            </Grid>
            <Grid item xs={12} md={4}>
            <Skeleton variant='rectangular'  />
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
            <Skeleton variant='rectangular'  />
            </Grid>

            <Grid item xs={12} md={6} lg={8}>
            <Skeleton variant='rectangular'  />
            </Grid>
            <Grid item xs={12} md={6} lg={8}>
            <Skeleton variant='rectangular'  />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
            <Skeleton variant='rectangular'  />
            </Grid>

            <Grid item xs={12} md={6} lg={12}>
            <Skeleton variant='rectangular'  />
            </Grid>
          </Grid>
        </Container>
      </Page>
  )
}
export default function Dashboard() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const {authedUser, dashboard} = useSelector((state)=>state);
  const ownerId = getOwnerId(authedUser);
  useEffect(()=>{
    dispatch(handleInit(ownerId))
  },[dispatch, ownerId])

  if(!dashboard){
    return <SkeletonLoader/>
  }
  return (
    <Page title="General: Dashboard | Tchopify">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Welcome />
          </Grid>

          <Grid item xs={12} md={4}>
            <Balance />
          </Grid>
          <Grid item xs={12} md={4}>
            <MarketplaceIncomes />
          </Grid>
          <Grid item xs={12} md={4}>
            <TotalOrders />
          </Grid>
          <Grid item xs={12} md={4}>
            <MonthlyIncomes />
          </Grid>
          

          <Grid item xs={12} md={6} lg={4}>
            <OrderByMode />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <DeliveryYearlySales />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <ShopSalesOverview />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <DineYearlySales />
          </Grid>

          <Grid item xs={12} md={6} lg={12}>
            <MostOrdered />
          </Grid>

         

          {/* <Grid item xs={12} md={6} lg={4}>
            <InviteFriends />
          </Grid>
          */}
        </Grid>
      </Container>
    </Page>
  );
}
