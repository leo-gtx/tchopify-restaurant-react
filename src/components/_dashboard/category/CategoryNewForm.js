import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import { useDispatch } from 'react-redux';
// material
import { styled } from '@material-ui/core/styles';
import { LoadingButton } from '@material-ui/lab';
import {
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
  FormHelperText,
} from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// utils
import { resizeThumbnail } from '../../../utils/imageResizer';
import { UploadSingleFile } from '../../upload';
// actions
import { handleNewCategory, handleEditCategory } from '../../../redux/actions/category';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

CategoryNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentCategory: PropTypes.object
};

export default function CategoryNewForm({ isEdit, currentCategory }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const NewCategorySchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    image: Yup.mixed().required('Image is required'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentCategory?.name || '',
      image: currentCategory?.image && {preview: currentCategory.image} || { preview: '' },
    },
    validationSchema: NewCategorySchema,
    onSubmit: (values, { setSubmitting, resetForm, setErrors }) => {

          const data = {
              id: currentCategory?.id,
              image: values.image.file,
              name: values.name
          }
          const onSuccess = ()=>{
            resetForm();
             setSubmitting(false);
            enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
            navigate(PATH_DASHBOARD.configuration.categories);
        }
        const onError = (error)=>{
          setSubmitting(false);
          setErrors(error);
      }
        if(!isEdit) dispatch(handleNewCategory(data, onSuccess, onError))
        else dispatch(handleEditCategory(data, onSuccess, onError))
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;


  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const image = resizeThumbnail(file);
      if (image) {
        setFieldValue('image', {
          file: image,
          preview: URL.createObjectURL(file)
        });
      }
    },
    [setFieldValue]
  );

  const handleRemove = () => {
    setFieldValue('image', []);
  };

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Category Name"
                  {...getFieldProps('name')}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />

               

                <div>
                  <LabelStyle>Add Image</LabelStyle>
                  <UploadSingleFile
                    showPreview
                    maxSize={10000000}
                    accept="image/*"
                    file={values.image}
                    onDrop={handleDrop}
                    onRemove={handleRemove}
                    error={Boolean(touched.image && errors.image)}
                  />
                  {touched.image && errors.image && (
                    <FormHelperText error sx={{ px: 2 }}>
                      {touched.image && errors.image}
                    </FormHelperText>
                  )}
                </div>
              </Stack>
            </Card>
            <LoadingButton type="submit" fullWidth variant="contained" size="large" loading={isSubmitting}>
                {!isEdit ? 'Create Category' : 'Save Changes'}
            </LoadingButton>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
