import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useFormik, Form, FormikProvider } from 'formik';
import { useTranslation } from 'react-i18next';
// material
import { Stack, Card, TextField } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// utils

// Actions
import { handleChangePassword } from '../../../../redux/actions/authedUser';

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar();
  const {t} = useTranslation();
  const ChangePassWordSchema = Yup.object().shape({
    newPassword: Yup.string().min(6, t('forms.passwordInvalid')).required(t('forms.newPasswordRequired')),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], t('forms.passwordMatch'))
  });

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmNewPassword: ''
    },
    validationSchema: ChangePassWordSchema,
    onSubmit: (values, { setSubmitting }) => {
      handleChangePassword(values, ()=>{
        setSubmitting(false);
        // alert(JSON.stringify(values, null, 2));
        enqueueSnackbar(t('flash.saveSuccess'), { variant: 'success' });
      })
      
    }
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <Card sx={{ p: 3 }}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3} alignItems="flex-end">
            <TextField
              {...getFieldProps('newPassword')}
              fullWidth
              autoComplete="on"
              type="password"
              label={t('forms.newPasswordLabel')}
              error={Boolean(touched.newPassword && errors.newPassword)}
              helperText={(touched.newPassword && errors.newPassword)}
            />

            <TextField
              {...getFieldProps('confirmNewPassword')}
              fullWidth
              autoComplete="on"
              type="password"
              label={t('forms.confirmPasswordLabel')}
              error={Boolean(touched.confirmNewPassword && errors.confirmNewPassword)}
              helperText={touched.confirmNewPassword && errors.confirmNewPassword}
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
