import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
// redux
import { useSelector } from 'react-redux';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import RestaurantNewForm from '../../components/_dashboard/restaurant/RestaurantNewForm';

// ----------------------------------------------------------------------

export default function RestaurantCreate() {
  const { themeStretch } = useSettings();
  const {t} = useTranslation();
  const { pathname } = useLocation();
  const { restaurantId } = useParams();
  const currentRestaurant = useSelector((state)=>state.restaurants[restaurantId])
  const isEdit = pathname.includes('edit');

  return (
    <Page title="User: Create a new restaurant | Tchopify">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? t('restaurantCreate.title1') : t('restaurantCreate.title2')}
          links={[
            { name: t('links.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('links.restaurant'), href: PATH_DASHBOARD.store.root },
            { name: !isEdit ? t('links.newRestaurant') : currentRestaurant.name }
          ]}
        />

        <RestaurantNewForm isEdit={isEdit} currentRestaurant={currentRestaurant} />
      </Container>
    </Page>
  );
}
