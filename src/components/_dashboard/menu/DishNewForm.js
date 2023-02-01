import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import {useSelector, useDispatch} from 'react-redux';
import { useTranslation } from 'react-i18next';
// material
import { styled } from '@material-ui/core/styles';
import { LoadingButton } from '@material-ui/lab';
import {
  Card,
  Chip,
  Grid,
  Stack,
  Switch,
  Select,
  TextField,
  InputLabel,
  Typography,
  FormControl,
  Autocomplete,
  InputAdornment,
  FormHelperText,
  FormControlLabel,
  DialogTitle,
  DialogActions,
  Box,
  Button,
} from '@material-ui/core';
// components 
import { DialogAnimate } from '../../animate';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// utils
import { resizeFileDish } from '../../../utils/imageResizer';
import { UploadSingleFile } from '../../upload';
import { getOwnerId } from '../../../utils/utils';
// actions
import { handleAddDish, handleEditDish } from '../../../redux/actions/dishes';


// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

DishNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentDish: PropTypes.object
};

export default function DishNewForm({ isEdit, currentDish }) {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const [addon, setAddon] = useState({
    name: '',
    price: '',
  });
  const [addons, setAddons] = useState([]);
  const handleClose = ()=>setOpen(false);
  const handleOpen = ()=>setOpen(true);
  const handleConfirm = ()=>{
    setAddons([...addons, `${addon.name} - ${addon.price} XAF`]);
    handleClose()
  }
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const authedUser = useSelector((state)=>state.authedUser);
  const categories = useSelector((state) => Object.values(state.categories.sub));
  const groups = useSelector((state) => Object.values(state.categories.meta));
  const NewDishSchema = Yup.object().shape({
    name: Yup.string().required(t('forms.nameRequired')),
    description: Yup.string().required(t('forms.descriptionRequired')),
    image: Yup.mixed().required(t('forms.imageRequired')),
    price: Yup.number().min(100, t('forms.priceInvalid')).required(t('forms.priceRequired')),
    cookingTime: Yup.number().required(t('forms.cookingTimeRequired')),
    category: Yup.string().required(t('forms.categoryRequired')),
    isSingleOption: Yup.boolean()
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentDish?.name || '',
      description: currentDish?.description || '',
      image: currentDish?.image && {preview: currentDish.image} || { preview: '' },
      cookingTime: currentDish?.cookingTime || '',
      price: currentDish?.price || '',
      options: currentDish?.options || [],
      isSingleOption: currentDish?.isSingleOption || false,
      isPublished: currentDish?.isPublished || false,
      category: currentDish?.category
    },
    validationSchema: NewDishSchema,
    onSubmit: (values, { setSubmitting, resetForm, setErrors }) => {
      const onSuccess = ()=>{
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? t('flash.createSuccess') : t('flash.updateSuccess'), { variant: 'success' });
        navigate(PATH_DASHBOARD.menu.dishes);
      }
      const onError = (error)=>{
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
      const data = {
        ...values,
        image: values.image.file,
        owner: getOwnerId(authedUser),
        oldImage: currentDish?.filename,
        id: currentDish?.id,
      }
      if(!isEdit) dispatch(handleAddDish(data,onSuccess, onError))
      else dispatch(handleEditDish(data, onSuccess, onError))
      
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      const image = await resizeFileDish(file);
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
    setFieldValue('image', {});
  };


  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label={t('forms.nameLabel')}
                  {...getFieldProps('name')}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />

                  <TextField
                  fullWidth
                  multiline
                  rows={5}
                  label={t('forms.descriptionLabel')}
                  {...getFieldProps('description')}
                  error={Boolean(touched.description && errors.description)}
                  helperText={touched.description && errors.description}
                  />

                <div>
                  <LabelStyle>{ t('forms.imageLabel') }</LabelStyle>
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
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Card sx={{ p: 3 }}>

                <Stack spacing={3}>
                  <TextField 
                  fullWidth 
                  type='number' 
                  placeholder='10' 
                  label={t('forms.cookingTimeLabel')}
                  {...getFieldProps('cookingTime')} 
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Min</InputAdornment>,
                    type: 'number'
                  }}
                  />

                  <FormControl fullWidth>
                    <InputLabel>{t('forms.categoryLabel')}</InputLabel>
                    <Select 
                    label={t('forms.categoryLabel')}
                    native {...getFieldProps('category')} 
                    value={values.category}
                    error={Boolean(touched.category && errors.category)}
                    >
                      <option>{t('forms.categoryDescription')}</option>
                      {groups.map((group) => (
                        <optgroup key={group.id} label={group.name}>
                          {categories.filter((category)=>category.categoryGroup === group.id ).map((category) => (
                            <option key={category.id} value={category.name}>
                              {category.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </Select>
                    {touched.category && errors.category && (
                    <FormHelperText error sx={{ px: 2 }}>
                      {touched.category && errors.category}
                    </FormHelperText>
                  )}
                  </FormControl>
                  <Autocomplete
                    multiple
                    value={values.options}
                    onChange={(event, newValue) => {
                      setFieldValue('options', newValue)
                    }}
                    options={addons.map((option)=>option)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip key={index} size="small" label={option} {...getTagProps({ index })} />
                      ))
                    }
                    renderInput={(params) => <TextField label={t('forms.optionsLabel')} {...params} />}
                  />
                  <FormControlLabel
                    control={<Switch {...getFieldProps('isSingleOption')} checked={values.isSingleOption} />}
                    label={t('forms.singleOptionLabel')}
                    sx={{ mt: 2 }}
                  />
                  <Button type="button" variant="text" size="large" onClick={handleOpen}>
                    {t('actions.addOption')}
                  </Button>
                  
                </Stack>
              </Card>

              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    placeholder="000.00"
                    label={t('forms.priceLabel')}
                    {...getFieldProps('price')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">XAF</InputAdornment>,
                      type: 'number'
                    }}
                    error={Boolean(touched.price && errors.price)}
                    helperText={touched.price && errors.price}
                  />

                </Stack>

                <FormControlLabel
                  control={<Switch {...getFieldProps('isPublished')} checked={values.isPublished} />}
                  label={t('forms.publishLabel')}
                  sx={{ mt: 2 }}
                />
              </Card>

              <LoadingButton type="submit" fullWidth variant="contained" size="large" loading={isSubmitting}>
                {!isEdit ? t('actions.createDish') : t('actions.saveChanges')}
              </LoadingButton>
            </Stack>
          </Grid>
          <DialogAnimate open={isOpen} onClose={handleClose}>
            <DialogTitle>{ t('forms.addOption') }</DialogTitle>
              <Stack>
                <Card sx={{p:3}}>
                <TextField
                    fullWidth
                    placeholder="Mayo"
                    label={t('forms.nameLabel')}
                    value={addon.name}
                    onChange={(event)=>{
                      setAddon({...addon, name: event.currentTarget.value})
                    }}
                  />
                </Card>
                <Card sx={{p:3}}>
                <TextField
                    fullWidth
                    placeholder="000.00"
                    label={t('forms.priceLabel')}
                    value={addon?.price}
                    onChange={(event)=>{
                      setAddon({...addon, price: event.currentTarget.value})
                    }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">XAF</InputAdornment>,
                      type: 'number'
                    }}
                  />
                </Card>
                </Stack>
            <DialogActions>
          <Box sx={{ flexGrow: 1 }} />
          <Button type="button" variant="outlined" color="inherit" onClick={handleClose}>
            {t('actions.cancel')}
          </Button>
          <LoadingButton type="submit" variant="contained"  loadingIndicator={t('actions.loading')} onClick={handleConfirm}>
            {t('actions.save')}
          </LoadingButton>
        </DialogActions>
          </DialogAnimate>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
