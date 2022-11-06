import { merge } from 'lodash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box, TextField } from '@material-ui/core';
//
import { BaseOptionChart } from '../../charts';

// ----------------------------------------------------------------------

export default function DeliveryYearlySales() {
  const {t} = useTranslation();
  const { yearlySalesByDelivery } = useSelector((state)=>state.dashboard);
  const CHART_DATA = Object.keys(yearlySalesByDelivery.data).map((key)=>({
    year: key,
    data: [
      { 
        name: t('dashboard.deliveryIncomes'),
        data: yearlySalesByDelivery?.data[key]?.map((item)=>Object.values(item)[0])
      }
    ]
  }))
  const [seriesData, setSeriesData] = useState(CHART_DATA[0]?.year);
  const handleChangeSeriesData = (event) => {
    setSeriesData(Number(event.target.value));
  };

  const chartOptions = merge(BaseOptionChart(), {
    legend: { position: 'top', horizontalAlign: 'right' },
    xaxis: {
      categories: yearlySalesByDelivery?.label[seriesData]?.map((item)=>Object.values(item)[0])
    }
  });

  

  return (
    <Card>
      <CardHeader
        title={t('dashboard.titleSalesDelivery')}
        action={
          <TextField
            select
            fullWidth
            value={seriesData}
            SelectProps={{ native: true }}
            onChange={handleChangeSeriesData}
            sx={{
              '& fieldset': { border: '0 !important' },
              '& select': { pl: 1, py: 0.5, pr: '24px !important', typography: 'subtitle2' },
              '& .MuiOutlinedInput-root': { borderRadius: 0.75, bgcolor: 'background.neutral' },
              '& .MuiNativeSelect-icon': { top: 4, right: 0, width: 20, height: 20 }
            }}
          >
            {CHART_DATA.map((option) => (
              <option key={option.year} value={option.year}>
                {option.year}
              </option>
            ))}
          </TextField>
        }
      />

      {CHART_DATA.map((item) => (
        <Box key={item.year} sx={{ mt: 3, mx: 3 }} dir="ltr">
          {item.year === seriesData && (
            <ReactApexChart type="area" series={item.data} options={chartOptions} height={364} />
          )}
        </Box>
      ))}
    </Card>
  );
}
