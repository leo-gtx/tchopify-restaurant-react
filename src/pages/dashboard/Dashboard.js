// material
import { Container, Grid } from '@material-ui/core';
// hooks
import useSettings from '../../hooks/useSettings';
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
  PosIncome
//  InviteFriends
} from '../../components/_dashboard/general-ecommerce';
// actions 

// ----------------------------------------------------------------------

export default function Dashboard() {
  const { themeStretch } = useSettings();
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
            <TotalOrders />
          </Grid>
          <Grid item xs={12} md={4}>
            <PosIncome />
          </Grid>
          <Grid item xs={12} md={4}>
            <MarketplaceIncomes />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <OrderByMode />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <DeliveryYearlySales />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <DineYearlySales />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MostOrdered />
          </Grid>

          <Grid item xs={12} md={6} lg={12}>
            <ShopSalesOverview />
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
