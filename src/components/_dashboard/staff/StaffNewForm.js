import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import { LoadingButton } from '@material-ui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  TextField,
  IconButton,
  InputAdornment,
} from '@material-ui/core';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// actions
import { handleEditStaff, handleAddStaff } from '../../../redux/actions/staffs';
// utils
import { ROLES } from '../../../utils/utils';

// ----------------------------------------------------------------------

StaffNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentStaff: PropTypes.object
};

export default function StaffNewForm({ isEdit, currentStaff }) {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const {authedUser, restaurants} = useSelector(state=>state);
  const NewStaffSchema = Yup.object().shape({
    firstName: Yup.string().required(t('forms.firstnameRequired')),
    lastName: Yup.string().required(t('forms.lastnameRequired')),
    email: Yup.string().email(t('forms.emailInvalid')).required(t('forms.emailRequired')),
    password: !isEdit && Yup.string().min(6, t('forms.passwordInvalid')).required(t('forms.passwordRequired')),
    role: Yup.string().required(t('forms.roleRequired')),
    shop: Yup.string().required(t('forms.shopRequired'))
  });
  const handleShowPassword = ()=> setShowPassword(!showPassword)
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: currentStaff?.fullname.split(' ')[0] || '',
      lastName: currentStaff?.fullname.split(' ')[1] || '',
      email: currentStaff?.email || '',
      password: '',
      role: currentStaff?.role || '',
      shop: ''
    },
    validationSchema: NewStaffSchema,
    onSubmit: (values, { setSubmitting, resetForm, setErrors }) => {
      const onSuccess = ()=>{
        resetForm();
        setSubmitting(false);
        enqueueSnackbar( !isEdit ?t('flash.createSuccess'):t('flash.updateSuccess'), { variant: 'success' });
        navigate(PATH_DASHBOARD.staff.list);
      }
      const onError=(error)=>{
        console.error(error);
        setSubmitting(false);
        setErrors(error);
        enqueueSnackbar('Create error', { variant: 'error' });
      }
        const data =  {
          ...values,
          owner: authedUser?.id,
          id: currentStaff?.id,
        };
        if(!isEdit)
          handleAddStaff(data, onSuccess, onError) 
          else
          dispatch(handleEditStaff(data, onSuccess, onError))

    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;


  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>

          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label={t('forms.firstnameLabel')}
                    {...getFieldProps('firstName')}
                    error={Boolean(touched.firstName && errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                  />
                  <TextField
                    fullWidth
                    label={t('forms.lastnameLabel')}
                    {...getFieldProps('lastName')}
                    error={Boolean(touched.lastName && errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                  />
                  <TextField
                    fullWidth
                    label={t('forms.emailLabel')}
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                    disabled={isEdit}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  { !isEdit && (<TextField
                    fullWidth
                    autoComplete="current-password"
                    type={showPassword ? 'text' : 'password'}
                    label={t('forms.passwordLabel')}
                    {...getFieldProps('password')}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleShowPassword} edge="end">
                            <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    error={Boolean(touched.password && errors.password)}
                    helperText={touched.password && errors.password}
                  />)}
                  <TextField
                    select
                    fullWidth
                    label={t('forms.roleLabel')}
                    placeholder={t('forms.roleLabel')}
                    {...getFieldProps('role')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.role && errors.role)}
                    helperText={touched.role && errors.role}
                  >
                    <option value="" />
                    {[
                      ROLES.admin,
                      ROLES.chef,
                      ROLES.waitress
                    ].map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                  <TextField
                    select
                    fullWidth
                    label={t('forms.shopLabel')}
                    placeholder={t('forms.shopLabel')}
                    {...getFieldProps('shop')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.shop && errors.shop)}
                    helperText={touched.shop && errors.shop}
                  >
                    <option value="" />
                    {Object.values(restaurants).map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </TextField>
                </Stack>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? t('actions.createStaff') : t('action.saveChanges')}
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
