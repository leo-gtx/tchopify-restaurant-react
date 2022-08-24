// material
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Card, CardHeader, Typography, Stack, LinearProgress } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { sum } from 'lodash';
// utils
import { fPercent, fCurrency } from '../../../utils/formatNumber';


// ----------------------------------------------------------------------


ProgressItem.propTypes = {
  progress: PropTypes.shape({
    label: PropTypes.string,
    amount: PropTypes.number,
    value: PropTypes.number,
    index: PropTypes.number
  })
};

function ProgressItem({ progress }) {
  
  return (
    <Stack spacing={1}>
      <Stack direction="row" alignItems="center">
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          {progress.label}
        </Typography>
        <Typography variant="subtitle2">{fCurrency(progress.amount)}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          &nbsp;({fPercent(progress.value)})
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={progress.value}
        color={
          (progress.index % 2 === 0 ? 'info': 'primary')
        }
      />
    </Stack>
  );
}

export default function EcommerceSalesOverview() {
  const { incomesDoneByShop } = useSelector((state)=>state.dashboard)
  const LABELS = Object.keys(incomesDoneByShop);
  const {t} = useTranslation();
  return (
    <Card>
      <CardHeader title={t('dashboard.saleoverview')}/>
      <Stack spacing={4} sx={{ p: 3 }}>
        {LABELS.map((item, index) => (
          <ProgressItem key={item} progress={{ index, label: item, amount: incomesDoneByShop[item], value: ( incomesDoneByShop[item] / sum(Object.values(incomesDoneByShop)) ) * 100}} />
        ))}
      </Stack>
    </Card>
  );
}
