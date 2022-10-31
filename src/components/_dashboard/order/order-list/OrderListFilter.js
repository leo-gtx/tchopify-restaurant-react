import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Form, FormikProvider } from 'formik';
import { useTranslation } from 'react-i18next';
import closeFill from '@iconify/icons-eva/close-fill';
import roundClearAll from '@iconify/icons-ic/round-clear-all';
// material
import {
  Box,
  Radio,
  Stack,
  Button,
  Drawer,
  Divider,
  Typography,
  RadioGroup,
  FormControlLabel,
  TextField,
} from '@material-ui/core';
import { DatePicker, LocalizationProvider } from '@material-ui/lab';
import AdapterDate from '@date-io/date-fns';
//
import { MIconButton } from '../../../@material-extend';
import Scrollbar from '../../../Scrollbar';


// ----------------------------------------------------------------------

export const STATUS_FILTER = [
    { value: 'new', label: 'history.filter.new' },
    { value: 'accepted', label: 'history.filter.accepted' },
    { value: 'ready', label: 'history.filter.ready' },
    { value: 'rejected', label: 'history.filter.rejected' },
    { value: 'shipping', label: 'history.filter.shipping' },
    { value: 'completed', label: 'history.filter.completed' },
]


// ----------------------------------------------------------------------

OrderListFilter.propTypes = {
  isOpenFilter: PropTypes.bool,
  onResetFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
  formik: PropTypes.object,
  shops: PropTypes.array,
  staffs: PropTypes.array,
};

export default function OrderListFilter({ isOpenFilter, onResetFilter, onCloseFilter, formik, shops, staffs }) {
  const {t} = useTranslation();
  const { values, getFieldProps, touched, errors, setFieldValue } = formik;
  return (
    <>

      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate>
          <Drawer
            anchor="right"
            open={isOpenFilter}
            onClose={onCloseFilter}
            PaperProps={{
              sx: { width: 280, border: 'none', overflow: 'hidden' }
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
              <Typography variant="subtitle1" sx={{ ml: 1 }}>
                {t('history.filter.title')}
              </Typography>
              <MIconButton onClick={onCloseFilter}>
                <Icon icon={closeFill} width={20} height={20} />
              </MIconButton>
            </Stack>

            <Divider />

            <Scrollbar>
              <Stack spacing={3} sx={{ p: 3 }}>

                <div>
                  <Typography variant="subtitle1" gutterBottom>
                    {t('history.filter.shop')}
                  </Typography>
                  <RadioGroup {...getFieldProps('shop')}>
                  <FormControlLabel value='all' control={<Radio />} label={t('history.filter.all')} />
                    {shops.map((item) => (
                      <FormControlLabel key={item.id} value={item.name} control={<Radio />} label={item.name} />
                    ))}
                  </RadioGroup>
                </div>

                <div>
                <LocalizationProvider dateAdapter={AdapterDate} >
                    <DatePicker
                        label={t('forms.startDate')}
                        value={values.startDate}
                        onChange={(date) => {
                            setFieldValue('startDate', date)
                            if(!values.endDate){
                                setFieldValue('endDate', date)
                            }
                        }}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />

                    <DatePicker
                        label={t('forms.endDate')}
                        value={values.endDate}
                        onChange={(date) => {
                            setFieldValue('endDate', date)
                            if(!values.startDate){
                                setFieldValue('startDate', date)
                            }
                        }}
                        renderInput={(params) => (
                        <TextField
                            {...params}
                            fullWidth
                            error={Boolean(touched.endDate && errors.endDate)}
                            helperText={touched.endDate && errors.endDate}
                            sx={{ mb: 3 }}
                        />
                        )}
                    />
                </LocalizationProvider>

                </div>


                <div>
                  <Typography variant="subtitle1" gutterBottom>
                  {t('history.filter.status')}
                  </Typography>
                  <RadioGroup {...getFieldProps('status')}>
                    {STATUS_FILTER.map((item) => (
                      <FormControlLabel key={item.value} value={item.value} control={<Radio />} label={t(item.label)} />
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Typography variant="subtitle1" gutterBottom>
                  {t('history.filter.staff')}
                  </Typography>
                  <RadioGroup {...getFieldProps('staff')}>
                    {staffs.map((item, index) => (
                      <FormControlLabel key={item.id} value={item.fullname} control={<Radio />} label={item.fullname} />
                    ))}
                  </RadioGroup>
                </div>
              </Stack>
            </Scrollbar>

            <Box sx={{ p: 3 }}>
              <Button
                fullWidth
                size="large"
                type="submit"
                color="inherit"
                variant="outlined"
                onClick={onResetFilter}
                startIcon={<Icon icon={roundClearAll} />}
              >
                {t('actions.clearAll')}
              </Button>
            </Box>
          </Drawer>
        </Form>
      </FormikProvider>
    </>
  );
}
