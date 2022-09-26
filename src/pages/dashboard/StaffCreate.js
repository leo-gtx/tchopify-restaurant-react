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
import StaffNewForm from '../../components/_dashboard/staff/StaffNewForm';

// ----------------------------------------------------------------------

export default function StaffCreate() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { name } = useParams();
  const currentStaff = useSelector((state) => state.staffs[name]);
  const isEdit = pathname.includes('edit');
  const {t} = useTranslation();
  return (
    <Page title={`Staff: ${!isEdit ? t('staffCreate.title1') : t('staffCreate.title2')} | Tchopify`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? t('staffCreate.title1') : t('staffCreate.title2')}
          links={[
            { name: t('links.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('links.staff'), href: PATH_DASHBOARD.staff.list },
            { name: !isEdit ? t('links.newStaff') : name }
          ]}
        />

        <StaffNewForm isEdit={isEdit} currentStaff={currentStaff} />
      </Container>
    </Page>
  );
}
