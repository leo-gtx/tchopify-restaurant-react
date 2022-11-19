import PropTypes from 'prop-types';
import { sortBy } from 'lodash';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import downloadFill from '@iconify/icons-eva/download-fill';
import optionsFill from '@iconify/icons-eva/options-fill';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
// material
import { Box, Tooltip, IconButton, DialogActions, Stack, Button, Radio, FormControlLabel, RadioGroup } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
//
import { DialogAnimate } from '../../animate';
import ReportingPDF from './ReportingPDF';
import StatisticPDF from './StatisticPDF';

// ----------------------------------------------------------------------

ReportingToolbar.propTypes = {
  reporting: PropTypes.object.isRequired
};

const STATISTIC = 'STATISTIC_REPORT';
const SALES = 'SALES_REPORT';

export default function ReportingToolbar({ reporting }) {
  const [openPDF, setOpenPDF] = useState(false);
  const [openOption, setOpenOption] = useState(false);
  const [carts, setCarts] = useState([]);
  const [reportType, setReportType] = useState(SALES);

  const {t} = useTranslation();

  const handleChange=(e)=>{
    console.log(e.target.value)
    setReportType(e.target.value)
  }
  const handleOpenOption = ()=>{
    setOpenOption(true);
  }
  const handleCloseOption = ()=>{
    setOpenOption(false);
  }
  const handleOpenPreview = () => {
    setOpenPDF(true);
  };

  const handleClosePreview = () => {
    setOpenPDF(false);
  };

  const {orders} = reporting;

  useEffect(()=>{
    if(orders.length > 0){
      let result = [];
      orders.forEach((order)=>{
        result = result.concat(order.cart)
      })
      setCarts(sortBy(result, (order)=>order.name, 'asc'))
    }
  },[orders, setCarts])

  return (
    <>
      <Stack mb={5} direction="row" justifyContent="flex-end" spacing={1.5}>
        <Tooltip
          open={openOption}
          onClose={handleCloseOption}
          onOpen={handleOpenOption}
          placement='top'
          title={(
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} >
                <RadioGroup
                  value={reportType}
                  onChange={handleChange}
                >
                  <FormControlLabel 
                    value={STATISTIC} 
                    control={<Radio />}
                    label={t('common.statistic')} 
                  />
                  <FormControlLabel 
                    value={SALES} 
                    control={<Radio />}
                    label={t('common.reporting')} 
                  />
                </RadioGroup>
                
              </Stack>
            </Stack>
          )}
        >
          <IconButton
           onClick={handleOpenOption}
          >
            <Icon icon={optionsFill} height={20} width={20}/>
          </IconButton>
        </Tooltip>
        <Button
            color="info"
            size="small"
            variant="contained"
            onClick={handleOpenPreview}
            endIcon={<Icon icon={eyeFill} />}
            sx={{ mx: 1 }}
          >
            Preview
          </Button>

        <PDFDownloadLink
          document={
            reportType === STATISTIC?
             <StatisticPDF reporting={{...reporting, carts}} />:
             <ReportingPDF reporting={reporting} />
          }
          fileName={
            reportType === STATISTIC?
             t('common.statistic'):
              t('common.reporting')
          }
          style={{ textDecoration: 'none' }}
        >
          {({ loading }) => (
            <LoadingButton
              size="small"
              loading={loading}
              variant="contained"
              loadingPosition="end"
              endIcon={<Icon icon={downloadFill} />}
            >
              Download
            </LoadingButton>
          )}
        </PDFDownloadLink>
      </Stack>

      <DialogAnimate fullScreen open={openPDF}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              zIndex: 9,
              padding: '12px !important',
              boxShadow: (theme) => theme.customShadows.z8
            }}
          >
            <Tooltip title="Close">
              <IconButton color="inherit" onClick={handleClosePreview}>
                <Icon icon={closeFill} />
              </IconButton>
            </Tooltip>
          </DialogActions>
          <Box sx={{ flexGrow: 1, height: '100%', overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              {
                reportType === STATISTIC ?
                  <StatisticPDF reporting={{...reporting, carts}} />:
                  <ReportingPDF reporting={reporting} />
              }
              
            </PDFViewer>
          </Box>
        </Box>
      </DialogAnimate>
    </>
  );
}
