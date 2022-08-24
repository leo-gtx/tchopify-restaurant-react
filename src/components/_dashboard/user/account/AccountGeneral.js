import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useCallback } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
// material
import {
  Box,
  Grid,
  Card,
  Stack,
  TextField,
  Typography,
  FormHelperText,
  InputAdornment,
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@material-ui/core/styles';
import Label from '../../../Label';
// hooks
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
import { UploadAvatar } from '../../../upload';
// actions
import { handleUpdateProfile } from '../../../../redux/actions/authedUser';
// utils
import { fData } from '../../../../utils/formatNumber';
import { getRoleFromUser } from '../../../../utils/utils';
import countries from '../countries';
import { resizeThumbnail } from '../../../../utils/imageResizer';
//

// ----------------------------------------------------------------------
export default function AccountGeneral() {
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const {t} = useTranslation();
  const user = useSelector(state=>state.authedUser);
  const dispatch = useDispatch();
  const UpdateUserSchema = Yup.object().shape({
    fullname: Yup.string().required(t('forms.nameRequired')),
    phoneNumber: Yup.number().required(t('forms.phoneNumberRequired')),
    country: Yup.number().required(t('forms.countryRequired')),
    city: Yup.string().required(t('forms.cityLabel'))
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullname: user.fullname || '',
      email: user.email || '',
      photoURL: user.avatar || {},
      phoneNumber: user.phoneNumber || '',
      country: countries.findIndex((item)=>item.code === user.country.code) || 0,   
      city: user.city ||'',
    },

    validationSchema: UpdateUserSchema,
    onSubmit: (values, { setErrors, setSubmitting }) => {
        const data = {
          ...values,
          country: countries[values.country],
          image: values.photoURL.file,
          userId: user.id,
          oldAvatar: user.filename
        };
        dispatch(handleUpdateProfile(data, ()=>{
          if (isMountedRef.current) {
            setSubmitting(false);
          }
          enqueueSnackbar(t('flash.updateSuccess'), { variant: 'success' });
        }, (error)=>{
          if (isMountedRef.current) {
            setErrors({ afterSubmit: error.code });
            setSubmitting(false);
            enqueueSnackbar(t('flash.updateFailure'), { variant: 'error' });
          }
        }));

    }
  });

  const { values, errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue, isValid } = formik;

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      const image = await resizeThumbnail(file);
      if (image) {
        setFieldValue('photoURL', {
          file: image,
          preview: URL.createObjectURL(file)
        });
      }
    },
    [setFieldValue]
  );


  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
              <UploadAvatar
                accept="image/*"
                file={values.photoURL}
                maxSize={10000000}
                onDrop={handleDrop}
                error={Boolean(touched.photoURL && errors.photoURL)}
                caption={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary'
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(10000000)}
                  </Typography>
                }
              />

              <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                {touched.photoURL && errors.photoURL}
              </FormHelperText>
              <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color='info'
                          >
                            {getRoleFromUser(user)}
              </Label>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={{ xs: 2, md: 3 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField fullWidth label={t('forms.nameLabel')} {...getFieldProps('fullname')} />
                  <TextField fullWidth disabled label={t('forms.emailLabel')} {...getFieldProps('email')} />
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                    select
                    fullWidth
                    label={t('forms.countryLabel')}
                    placeholder={t('forms.countryLabel')}
                    {...getFieldProps('country')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.country && errors.country)}
                    helperText={touched.country && errors.country}
                  >
                    <option value="" />
                    {countries.map((option,index) => (
                      <option key={option.code} value={index}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                  <TextField
                    fullWidth
                    label={t('forms.cityLabel')}
                    {...getFieldProps('city')}
                    error={Boolean(touched.city && errors.city)}
                    helperText={touched.city && errors.city}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField 
                    fullWidth 
                    label={t('forms.phoneNumberLabel')} 
                    {...getFieldProps('phoneNumber')} 
                    InputProps={{
                      startAdornment: <InputAdornment position="start">{`+${countries[values.country]?.phone}`}</InputAdornment>,
                      type: 'number'
                    }}
                  />
                </Stack>

                
              </Stack>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <LoadingButton type="submit" variant="contained" disabled={!isValid || isSubmitting} loading={isSubmitting}>
                  {t('actions.saveChanges')}
                </LoadingButton>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
