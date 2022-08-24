import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import { useDispatch  } from 'react-redux';
import { Form, FormikProvider, useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
// material
import { OutlinedInput, FormHelperText, Stack } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// actions
import { handleGetUser  } from '../../../redux/actions/authedUser';


// ----------------------------------------------------------------------

VerifyCodeForm.propTypes = {
  onConfirmation: PropTypes.object
}

// eslint-disable-next-line consistent-return
function maxLength(object) {
  if (object.target.value.length > object.target.maxLength) {
    return (object.target.value = object.target.value.slice(0, object.target.maxLength));
  }
}

export default function VerifyCodeForm({ onConfirmation }) {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const VerifyCodeSchema = Yup.object().shape({
    code1: Yup.number().required(t('forms.codeRequired')),
    code2: Yup.number().required(t('forms.codeRequired')),
    code3: Yup.number().required(t('forms.codeRequired')),
    code4: Yup.number().required(t('forms.codeRequired')),
    code5: Yup.number().required(t('forms.codeRequired')),
    code6: Yup.number().required(t('forms.codeRequired'))
  });

  const formik = useFormik({
    initialValues: {
      code1: '',
      code2: '',
      code3: '',
      code4: '',
      code5: '',
      code6: ''
    },
    validationSchema: VerifyCodeSchema,
    onSubmit:() => {
      const code = `${values.code1}${values.code2}${values.code3}${values.code4}${values.code5}${values.code6}`
      onConfirmation.confirm(code)
      .then((result)=>{
        const data = {
          id: result.user.uid,
          phoneNumber: result.user.phoneNumber,
          role: 'ROLE_USER',
          fullname: result.user.phoneNumber
        }
        dispatch(handleGetUser(data, ()=>{
          enqueueSnackbar(t('flash.verifySuccess'), { variant: 'success' });
        }));
        
      })
      .catch((err)=>{
        console.error(err);
        enqueueSnackbar(t('flash.verifyFailure'), { variant: 'error' });
      })
      
    }
  });

  const { values, errors, isValid, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack direction="row" spacing={2} justifyContent="center">
          {Object.keys(values).map((item) => (
            <OutlinedInput
              key={item}
              {...getFieldProps(item)}
              type="number"
              placeholder="-"
              onInput={maxLength}
              error={Boolean(touched[item] && errors[item])}
              inputProps={{
                maxLength: 1,
                sx: {
                  p: 0,
                  textAlign: 'center',
                  width: { xs: 36, sm: 56 },
                  height: { xs: 36, sm: 56 }
                }
              }}
            />
          ))}
        </Stack>

        <FormHelperText error={!isValid} style={{ textAlign: 'right' }}>
          {!isValid && 'Code is required'}
        </FormHelperText>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} sx={{ mt: 3 }}>
          {t('actions.verify')}
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
