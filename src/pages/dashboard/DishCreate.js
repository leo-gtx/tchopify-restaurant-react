import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// material
import { Container } from '@material-ui/core';
// redux
import { useSelector, useDispatch } from 'react-redux';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import DishNewForm from '../../components/_dashboard/menu/DishNewForm';
// redux
import { handleGetCategories, handleGetSubCategories } from '../../redux/actions/category';
// utils
import { getOwnerId } from '../../utils/utils';


// ----------------------------------------------------------------------

export default function EcommerceProductCreate() {
  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { name } = useParams();
  const {dishes, authedUser} = useSelector(state=>state);
  const isEdit = pathname.includes('edit');
  const currentDish = Object.values(dishes).find((dish) => paramCase(dish.name) === name);
  const dispatch = useDispatch();
  const ownerId = getOwnerId(authedUser);

  useEffect(()=>{
    dispatch(handleGetCategories());
    dispatch(handleGetSubCategories(ownerId));
  },[dispatch, ownerId])

  return (
    <Page title="Menu: Create a new dish | Tchopify">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? t('dishCreate.title') : t('dishCreate.edit')}
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
