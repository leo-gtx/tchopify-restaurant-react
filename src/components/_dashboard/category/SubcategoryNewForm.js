import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import { useDispatch, useSelector} from 'react-redux';
import { useTranslation } from 'react-i18next';
// material
import { LoadingButton } from '@material-ui/lab';
import {
  Card,
  Grid,
  Stack,
  TextField
} from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// actions
import { handleNewSubcategory, handleEditSubcategory } from '../../../redux/actions/category';
// utils
import { getOwnerId } from '../../../utils/utils';

// ----------------------------------------------------------------------



// ----------------------------------------------------------------------

CategoryNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentCategory: PropTypes.object,
  categoryGroups: PropTypes.array
};

export default function CategoryNewForm({ isEdit, currentCategory, categoryGroups }) {
  const navigate = useNavigate();
  const {t} = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const {authedUser} = useSelector((state)=>state);
  const NewCategorySchema = Yup.object().shape({
    name: Yup.string().required(t('forms.nameRequired')),
    categoryGroup: Yup.string().required(t('forms.categoryGroupRequired')),
  });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentCategory?.name || '',
      categoryGroup: currentCategory?.categoryGroup || ''
    },
    validationSchema: NewCategorySchema,
    onSubmit: (values, { setSubmitting, resetForm, setErrors }) => {

          const data = {
              id: currentCategory?.id,
              categoryGroup: values.categoryGroup,
              name: values.name,
              owner: getOwnerId(authedUser),
          }
          const onSuccess = ()=>{
            resetForm();
             setSubmitting(false);
            enqueueSnackbar(!isEdit ? t('flash.createSuccess') : t('flash.updateSuccess'), { variant: 'success' });
            navigate(PATH_DASHBOARD.menu.subcategories);
        }
        const onError = (error)=>{
          setSubmitting(false);
          setErrors(error);
      }
        if (!isEdit)  dispatch(handleNewSubcategory(data,onSuccess,onError))
        else dispatch(handleEditSubcategory(data, onSuccess, onError))
    }
  });

  const { errors, touched, handleSubmit, isSubmitting,  getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <TextField
                  select
                  fullWidth
                  label={t('forms.categoryGroupLabel')}
                  SelectProps={{ native: true }}
                  {...getFieldProps('categoryGroup')}
                  error={Boolean(touched.categoryGroup && errors.categoryGroup)}
                  helperText={touched.categoryGroup && errors.categoryGroup}
                >
                    <option value="" />
                    {categoryGroups.map((group)=>(
                        <option  key={group.id} value={group.id}>{group.name}</option>
                    ))}
                </TextField>

                <div>
                <TextField
                  fullWidth
                  label={t('forms.categoryNameLabel')}
                  {...getFieldProps('name')}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />
                </div>
              </Stack>
            </Card>
            <LoadingButton type="submit" fullWidth variant="contained" size="large" loading={isSubmitting}>
                {!isEdit ? t('actions.createCategory') : t('actions.saveChanges')}
            </LoadingButton>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
