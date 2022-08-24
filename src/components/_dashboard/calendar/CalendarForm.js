import * as Yup from 'yup';
import { merge } from 'lodash';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import { useFormik, Form, FormikProvider } from 'formik';
import { useTranslation } from 'react-i18next';
// material
import {
  Box,
  Stack,
  Button,
  TextField,
  Switch,
  DialogActions,
  FormControlLabel,
} from '@material-ui/core';
import { LoadingButton , TimePicker, LocalizationProvider } from '@material-ui/lab';
import AdapterDate from '@date-io/date-fns';
// utils
import {toTimeString, getDay} from '../../../utils/utils';


// ----------------------------------------------------------------------

const getInitialValues = (event) => {
  const _event = {
    eventId: event.id,
    isOpen: event.daysOfWeek.includes(event.id),
    start: new Date(`01-01-22 ${event?.startTime}`),
    end: new Date(`01-01-22 ${event?.endTime}`)
  };

  if (event ) {
    return merge({}, _event, event);
  }

  return _event;
};

// ----------------------------------------------------------------------

CalendarForm.propTypes = {
  event: PropTypes.object,
  onCancel: PropTypes.func,
  onSave: PropTypes.func
};

export default function CalendarForm({ event, onCancel, onSave }) {
  const { enqueueSnackbar } = useSnackbar();
  const {t} = useTranslation();
  const EventSchema = Yup.object().shape({
    end: Yup.date().when(
      'start',
      (start, schema) => start && schema.min(start, t('forms.endDateInvalid'))
    ),
    start: Yup.date()
  });

  const formik = useFormik({
    initialValues: getInitialValues(event),
    validationSchema: EventSchema,
    onSubmit:(values, { resetForm, setSubmitting }) => {
        const updatedEvent = {
          id: values.id,
          title: values.isOpen? getDay(values.id): t('common.closed'),
          daysOfWeek: values.daysOfWeek,
          isOpen: values.isOpen,
          startTime: toTimeString(values.start),
          endTime: toTimeString(values.end)
        }
        onSave(updatedEvent)
        enqueueSnackbar(t('flash.updateBusinessHours'), { variant: 'success' });
        resetForm();
        onCancel();
        setSubmitting(false);
    }
  });

  const { values, errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;


  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{ p: 3 }}>
        <FormControlLabel control={<Switch checked={values.isOpen} {...getFieldProps('isOpen')} />} label="Open this day" />

          <LocalizationProvider dateAdapter={AdapterDate} >
          <TimePicker
            label={t('forms.openTime')}
            value={values.start}
            onChange={(date) => setFieldValue('start', date)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />

          <TimePicker
            label={t('forms.closeTime')}
            value={values.end}
            onChange={(date) => setFieldValue('end', date)}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                error={Boolean(touched.end && errors.end)}
                helperText={touched.end && errors.end}
                sx={{ mb: 3 }}
              />
            )}
          />

          </LocalizationProvider>
          
        </Stack>

        <DialogActions>
          <Box sx={{ flexGrow: 1 }} />
          <Button type="button" variant="outlined" color="inherit" onClick={onCancel}>
            {t('actions.cancel')}
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting} loadingIndicator={t('actions.loading')}>
            {t('actions.save')}
          </LoadingButton>
        </DialogActions>
      </Form>
    </FormikProvider>
  );
}
