import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// material
import { Container } from '@material-ui/core';
// redux
import {  useSelector, useDispatch } from 'react-redux';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import CategoryNewForm from '../../components/_dashboard/category/SubcategoryNewForm';
// Utils
import { jsUcfirst, getOwnerId } from '../../utils/utils';
// Actions
import { handleGetSubCategories, handleGetCategories } from '../../redux/actions/category';
// ----------------------------------------------------------------------

export default function ConfigurartionCategoryCreate() {
  const { themeStretch } = useSettings();
  const {t} = useTranslation();
  const { pathname } = useLocation();
  const { name } = useParams();
  const dispatch = useDispatch();
  const authedUser = useSelector((state) => state.authedUser);
  const categories = useSelector((state) => Object.values(state.categories.sub));
  const groups = useSelector((state) => Object.values(state.categories.meta));
  const isEdit = pathname.includes('edit');
  const currentCategory = categories.find((category) => paramCase(category.name) === name);
  useEffect(()=>{
    dispatch(handleGetCategories());
    dispatch(handleGetSubCategories(getOwnerId(authedUser)));
  },[dispatch, authedUser.id])
  return (
    <Page title="Menu: Create a new category | Tchopify">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? t('subcategoryCreate.title1') : t('subcategoryCreate.title2')}
          links={[
            { name: t('links.dashboard'), href: PATH_DASHBOARD.root },
            {
              name: t('links.menu'),
              href: PATH_DASHBOARD.menu.root
            },
            { name: t('links.categories'), href: PATH_DASHBOARD.menu.subcategories},
            { name: !isEdit? t('links.newCategory'):jsUcfirst(name.replace('-',' '))}
          ]}
        />

        <CategoryNewForm isEdit={isEdit} currentCategory={currentCategory} categoryGroups={groups} />
      </Container>
    </Page>
  );
}
