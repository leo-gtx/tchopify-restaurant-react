import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Form, FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack5';
import { useTranslation } from 'react-i18next'; 
// material
import { TextField, Alert, Stack } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';

// firebase
import firebase from '../../../firebase';
// ----------------------------------------------------------------------

PhoneNumberForm.propTypes = {
  onGetPhoneNumber: PropTypes.func,
  onGetConfirmation: PropTypes.func,
};
const phoneRegExp = /^\s*(?:\+?(\d{1,3}))?[\W\D\s]^|()*(\d[\W\D\s]*?\d[\D\W\s]*?\d)[\W\D\s]*(\d[\W\D\s]*?\d[\D\W\s]*?\d)[\W\D\s]*(\d[\W\D\s]*?\d[\D\W\s]*?\d[\W\D\s]*?\d)(?: *x(\d+))?\s*$/

export default function PhoneNumberForm({ onGetPhoneNumber, onGetConfirmation }) {
  const {t} = useTranslation();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();
  const ResetPasswordSchema = Yup.object().shape({
    phoneNumber: Yup.string().matches(phoneRegExp, t('forms.phoneNumberInvalid')).required(t('forms.phoneNumberRequired'))
  });

  const formik = useFormik({
    initialValues: {
      phoneNumber: ''
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: (values, { setErrors, setSubmitting }) => {

        if (isMountedRef.current) {
          const {phoneNumber} = values;
          window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
          const appVerifier = window.recaptchaVerifier;
          firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
              .then((confirmationResult) => {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                onGetPhoneNumber(phoneNumber);
                onGetConfirmation(confirmationResult);
                enqueueSnackbar(t('flash.smsSuccess'), {variant: 'info'});
                // ...
              }).catch((error) => {
                // Error; SMS not sent
                console.error(error);
                setErrors({ afterSubmit: error.message });
                enqueueSnackbar(t('flash.smsFailure'), {variant: 'error'});
                // grecaptcha.reset(appVerifier);
              })
              .finally(()=>{
                setSubmitting(false);
              })
          
        }

    }
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

          <TextField
            fullWidth
            {...getFieldProps('phoneNumber')}
            type="phone"
            label={t('forms.phoneNumberLabel')}
            error={Boolean(touched.phoneNumber && errors.phoneNumber)}
            helperText={touched.phoneNumber && errors.phoneNumber}
          />
          <div id='recaptcha-container'/>
          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            {t('actions.verifyPhoneNumber')}
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
