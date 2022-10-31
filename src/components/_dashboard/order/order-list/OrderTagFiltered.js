import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import roundClearAll from '@iconify/icons-ic/round-clear-all';
// material
import { styled } from '@material-ui/core/styles';
import { Chip, Typography, Stack, Button } from '@material-ui/core';
// utils
import { fDate } from '../../../../utils/formatTime';

// ----------------------------------------------------------------------

const RootStyle = styled('div')({
  flexGrow: 1,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center'
});

const WrapperStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  overflow: 'hidden',
  alignItems: 'stretch',
  margin: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${theme.palette.divider}`
}));

const LabelStyle = styled((props) => <Typography component="span" variant="subtitle2" {...props} />)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.neutral,
  borderRight: `solid 1px ${theme.palette.divider}`
}));

// ----------------------------------------------------------------------
function labelDateRange(startDate, endDate){
  return `From ${fDate(new Date(startDate))} to ${fDate(new Date(endDate))}`
}
// ----------------------------------------------------------------------

OrderTagFiltered.propTypes = {
  formik: PropTypes.object,
  filters: PropTypes.object,
  isShowReset: PropTypes.bool,
  isDefault: PropTypes.bool,
  onResetFilter: PropTypes.func
};

export default function OrderTagFiltered({ formik, filters, isShowReset, isDefault, onResetFilter }) {
  const {t} = useTranslation();
  const { values, setFieldValue, initialValues } = formik;
  const { status, startDate, endDate,shop, staff} = filters;
  const isShow = values !== initialValues && !isShowReset;

  const handleRemoveShop = () => {
    // handleSubmit();
    setFieldValue('shop', 'all');
  };


  const handleRemoveDateRange = () => {
    // handleSubmit();
    setFieldValue('startDate', '');
    setFieldValue('endDate', '');
  };

  const handleRemoveStatus = () => {
    // handleSubmit();
    setFieldValue('status', '');
  };

  const handleRemoveStaff = () => {
    setFieldValue('staff', '');
  }

  return (
    <RootStyle>
      {shop !== 'all' && (
        <WrapperStyle>
          <LabelStyle>{t('history.filter.shop')}:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            <Chip size="small" label={shop} onDelete={handleRemoveShop} sx={{ m: 0.5 }} />
          </Stack>
        </WrapperStyle>
      )}

      {status && (
        <WrapperStyle>
          <LabelStyle>{t('history.filter.status')}:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            <Chip size="small" label={status} onDelete={handleRemoveStatus} sx={{ m: 0.5 }} />
          </Stack>
        </WrapperStyle>
      )}

      {startDate && endDate && (
        <WrapperStyle>
          <LabelStyle>{t('history.filter.dateRange')}:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            <Chip size="small" label={t('history.filter.dateRangeLabel',{ startDate: fDate(startDate), endDate: fDate(endDate)})} onDelete={handleRemoveDateRange} sx={{ m: 0.5 }} />
          </Stack>
        </WrapperStyle>
      )}

      {staff && (
        <WrapperStyle>
          <LabelStyle>{t('history.filter.staff')}:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            <Chip size="small" label={staff} onDelete={handleRemoveStaff} sx={{ m: 0.5 }} />
          </Stack>
        </WrapperStyle>
      )}

      {isShow && !isDefault && (
        <Button
          color="error"
          size="small"
          type="button"
          onClick={onResetFilter}
          startIcon={<Icon icon={roundClearAll} />}
        >
          {t('actions.clearAll')}
        </Button>
      )}
    </RootStyle>
  );
}
