import { merge } from 'lodash';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box, TextField } from '@material-ui/core';
//
import { BaseOptionChart } from '../../charts';

// ----------------------------------------------------------------------

export default function MonthlySales() {
  const {t} = useTranslation();
  const { monthlySales } = useSelector((state)=>state.dashboard);
  const CHART_DATA = Object.keys(monthlySales?.data).map((key)=>({
    month: key,
    data: [
      { 
        name: t('dashboard.monthlyIncomes'),
        data: monthlySales?.data[key].map((item)=>Object.values(item)[0]) 
      }
    ]
  }))
  const [seriesData, setSeriesData] = useState(CHART_DATA[0]?.month);
  const handleChangeSeriesData = useCallback((event) => {
    setSeriesData(event.target.value);
  },[setSeriesData]);

  const chartOptions = merge(BaseOptionChart(), {
    legend: { position: 'top', horizontalAlign: 'right' },
    xaxis: {
      categories: monthlySales?.label[seriesData]?.map((item)=>Object.values(item)[0])
    }
  });

  

  return (
    <Card>
      <CardHeader
        title={t('dashboard.titleMonthlySales')}
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
            {CHART_DATA.map((option, index) => (
              <option key={index + option.month} value={option.month}>
                {option.month}
              </option>
            ))}
          </TextField>
        }
      />

      {CHART_DATA.map((item, index) => (
        <Box key={index + item.month} sx={{ mt: 3, mx: 3 }} dir="ltr">
          {item.month === seriesData && (
            <ReactApexChart type="area" series={item.data} options={chartOptions} height={364} />
          )}
        </Box>
      ))}
    </Card>
  );
}
