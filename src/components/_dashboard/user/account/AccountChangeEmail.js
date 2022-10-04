import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack5';
import { useFormik, Form, FormikProvider } from 'formik';
import { useTranslation } from 'react-i18next';
// material
import { Stack, Card, TextField } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// utils

// Actions
import { handleChangeEmail } from '../../../../redux/actions/authedUser';

// ----------------------------------------------------------------------

export default function AccountChangeEmail() {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const ChangeEmailSchema = Yup.object().shape({
    newEmail: Yup.string().min(6, t('forms.emailInvalid')).required(t('forms.emailRequired')),
  });

  const formik = useFormik({
    initialValues: {
      newEmail: '',
    },
    validationSchema: ChangeEmailSchema,
    onSubmit: (values, { setSubmitting, setErrors }) => {
        const onSuccess = ()=>{
            setSubmitting(false);
            enqueueSnackbar(t('flash.saveSuccess'), { variant: 'success' });
        }
        const onError = (error)=>{
            setSubmitting(false);
            setErrors({newEmail: error});
            console.error(error);
        }
      dispatch(handleChangeEmail(values.newEmail, onSuccess, onError));
      
    }
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <Card sx={{ p: 3 }}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3} alignItems="flex-end">
            <TextField
              {...getFieldProps('newEmail')}
              fullWidth
              autoComplete="on"
              type="email"
              label={t('forms.newEmailLabel')}
              error={Boolean(touched.newEmail && errors.newEmail)}
              helperText={(touched.newEmail && errors.newEmail)}
            />
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {t('actions.saveChanges')}
            </LoadingButton>
          </Stack>
        </Form>
      </FormikProvider>
    </Card>
  );
}
