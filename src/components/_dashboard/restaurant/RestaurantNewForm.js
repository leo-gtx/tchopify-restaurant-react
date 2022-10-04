import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useEffect} from 'react';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
// material
import { LoadingButton } from '@material-ui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
  FormHelperText,
  InputAdornment
} from '@material-ui/core';

// utils
import { fData } from '../../../utils/formatNumber';
import { resizeFileRestaurant } from '../../../utils/imageResizer';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import Label from '../../Label';
import { UploadSingleFile } from '../../upload';
// actions
import { handleNewRestaurant, handleEditRestaurant } from '../../../redux/actions/restaurant';

// ----------------------------------------------------------------------
RestaurantNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentRestaurant: PropTypes.object
};

const MODES = [
  {
    value: 'DELIVERY',
    label: 'restaurantCreate.delivery'
  },
  {
    value: 'TAKEAWAY',
    label: 'restaurantCreate.takeaway'
  },
  {
    value: 'DELIVERY_DINE',
    label: 'restaurantCreate.delivery_dine'
  },
  {
    value: 'TAKEAWAY_DINE',
    label: 'restaurantCreate.takeaway_dine'
  },
  { 
    value: 'DELIVERY_TAKEAWAY',
    label: 'restaurantCreate.takeaway_delivery'
  },
  {
    value: 'DELIVERY_TAKEAWAY_DINE',
    label: 'restaurantCreate.delivery_takeaway_dine'
  },
];
// ----------------------------------------------------------------------

export default function RestaurantNewForm({ isEdit, currentRestaurant }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const authedUser = useSelector(state=>state.authedUser)
  const {t} = useTranslation();
  const NewRestaurantSchema = Yup.object().shape({
    name: Yup.string().required(t('forms.nameRequired')),
    phoneNumber: Yup.string().required(t('forms.phoneNumberRequired')),
    location: Yup.string().required(t('forms.locationRequired')),
    mode: Yup.string().required(t('forms.modeRequired')),
    kmCost: Yup.number().min(50, t('forms.kmCostMin')).max(200, t('forms.kmCostMax')).when("mode",{
      is: (mode) => mode?.includes('DELIVERY'),
      then: Yup.number().min(50, t('forms.kmCostMin')).max(200, t('forms.kmCostMax')).required(t('forms.kmCostRequired'))
    })
  });


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: isEdit && currentRestaurant?.name || '',
      phoneNumber: isEdit && currentRestaurant?.phoneNumber || '',
      mode: isEdit && currentRestaurant?.mode || '',
      location: isEdit && currentRestaurant?.location || '',
      avatarUrl: isEdit && { preview: currentRestaurant?.image } || {},
      status: isEdit && currentRestaurant?.status || 'activated',
      kmCost: isEdit && currentRestaurant?.kmCost || ''
    },
    validationSchema: NewRestaurantSchema,
    onSubmit: (values, { setSubmitting, resetForm, setErrors }) => {
        const onError = (error)=>{
          console.error(error);
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? t('flash.createFailure') : t('flash.updateFailure'), { variant: 'error' });
        setErrors(error);
        }
        const callback = ()=>{
          resetForm();
          setSubmitting(false);
          enqueueSnackbar(!isEdit ? t('flash.createSuccess') : t('flash.updateSuccess'), { variant: 'success' });
          navigate(PATH_DASHBOARD.store.stores);
        }
        const data = {
          id: currentRestaurant?.id,
          name: values.name,
          phoneNumber: values.phoneNumber,
          location: values.location,
          image: values.avatarUrl.file,
          status: values.status,
          mode: values.mode,
          kmCost: values.kmCost,
          oldImage: currentRestaurant?.filename,
          createdAt: isEdit ? currentRestaurant?.createdAt : new Date(),
          owner: authedUser.id
        }
        if(!isEdit) dispatch(handleNewRestaurant(data, callback, onError))
        else dispatch(handleEditRestaurant(data, callback, onError))

    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      const image = await resizeFileRestaurant(file);
      if (image) {
        setFieldValue('avatarUrl', {
          file: image,
          preview: URL.createObjectURL(file)
        });
      }
    },
    [setFieldValue]
  );
  
  useEffect(() => {
   if ("geolocation" in navigator) {
       navigator.geolocation.getCurrentPosition((position) => {
           const center = { lat: position.coords.latitude, lng: position.coords.longitude }
           axios.post(`${process.env.REACT_APP_GOOGLE_GEOCODE_API_BASE_URL}/json?latlng=${center.lat},${center.lng}&key=${process.env.REACT_APP_GOOGLE_PLACE_API_KEY}`)
           .then((res)=>{

             setFieldValue('location', res.data.plus_code.compound_code)
           })
           .catch((err)=>console.error(err))
         });
       
     } else {
      setFieldValue('location', t('forms.locationInvalid'))
     }
 }, [navigator]) 
 
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3 }}>
              {isEdit && (
                <Label
                  color={values.status !== 'activated' ? 'error' : 'success'}
                  sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
                >
                  {values.status}
                </Label>
              )}

              <Box sx={{ mb: 5 }}>
                <UploadSingleFile
                  showPreview
                  accept="image/*"
                  file={values.avatarUrl}
                  maxSize={10000000}
                  onDrop={handleDrop}
                  error={Boolean(touched.avatarUrl && errors.avatarUrl)}
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
                  {touched.avatarUrl && errors.avatarUrl}
                </FormHelperText>
              </Box>
              
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label={t('forms.nameLabel')}
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    fullWidth
                    label={t('forms.phoneNumberLabel')}
                    {...getFieldProps('phoneNumber')}
                    error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                    helperText={touched.phoneNumber && errors.phoneNumber}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    select
                    SelectProps={{native: true}}
                    fullWidth
                    {...getFieldProps('mode')}
                    error={Boolean(touched.mode && errors.mode)}
                    helperText={touched.mode && errors.mode}
                  >
                    <option value="">{t('forms.modeLabel')}</option>
                    {
                      MODES.map((item, index)=>(
                        <option key={index} value={item.value}>{t(item.label)}</option>
                      ))
                    }
                    </TextField>
                    {
                      values.mode?.includes('DELIVERY') && (
                        <TextField
                          fullWidth
                          {...getFieldProps('kmCost')}
                          label={t('forms.kmCostLabel')}
                          type='number'
                          placeholder='50 - 200'
                          InputProps={{
                            startAdornment: <InputAdornment position="start">XAF</InputAdornment>,
                            type: 'number'
                          }}
                          error={Boolean(touched.kmCost && errors.kmCost)}
                          helperText={touched.kmCost && errors.kmCost}
                        />
                      )
                    }
                    
                </Stack>
                
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  
                    <TextField
                      fullWidth
                      label={t('forms.locationLabel')}
                      placeholder={t('forms.locationLabel')}
                      {...getFieldProps('location')}
                      error={Boolean(touched.location && errors.location)}
                      helperText={touched.location && errors.location}
                    />
                    
                  </Stack>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? t('createRestaurant') : t('saveChanges')}
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
