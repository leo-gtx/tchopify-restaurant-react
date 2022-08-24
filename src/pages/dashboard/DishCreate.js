
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import DishNewForm from '../../components/_dashboard/menu/DishNewForm';

// ----------------------------------------------------------------------

export default function EcommerceProductCreate() {
  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { name } = useParams();
  const  dishes = useSelector(state=>Object.values(state.dishes));
  const isEdit = pathname.includes('edit');
  const currentDish = dishes.find((dish) => paramCase(dish.name) === name);
  

  return (
    <Page title="Menu: Create a new dish | Tchopify">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? t('dishCreate.title') : ('dishCreate.edit')}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Menu',
              href: PATH_DASHBOARD.menu.root
            },
            { name: !isEdit ? t('dishCreate.title') : name }
          ]}
        />

        <DishNewForm isEdit={isEdit} currentDish={currentDish} />
      </Container>
    </Page>
  );
}
