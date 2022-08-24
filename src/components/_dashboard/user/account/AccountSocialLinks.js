import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack5';
import { useFormik, Form, FormikProvider } from 'formik';
import twitterFill from '@iconify/icons-eva/twitter-fill';
import linkedinFill from '@iconify/icons-eva/linkedin-fill';
import facebookFill from '@iconify/icons-eva/facebook-fill';
import instagramFilled from '@iconify/icons-ant-design/instagram-filled';
// material
import { Stack, Card, TextField, InputAdornment } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// redux
import { useSelector, useDispatch } from 'react-redux';
// utils

// actions 
import { handleAddSocialsLinks } from '../../../../redux/actions/authedUser';

// ----------------------------------------------------------------------

const SOCIAL_LINKS_OPTIONS = [
  {
    value: 'facebookLink',
    icon: <Icon icon={facebookFill} height={24} />
  },
  {
    value: 'instagramLink',
    icon: <Icon icon={instagramFilled} height={24} />
  },
  {
    value: 'linkedinLink',
    icon: <Icon icon={linkedinFill} height={24} />
  },
  {
    value: 'twitterLink',
    icon: <Icon icon={twitterFill} height={24} />
  }
];

// ----------------------------------------------------------------------

export default function AccountSocialLinks() {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const authedUser = useSelector((state) => state.authedUser);
  const socials = authedUser.socials || {
      facebookLink: '',
      instagramLink: '',
      linkedinLink:  '',
      twitterLink:  ''
  };
  const dispatch = useDispatch();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      facebookLink: socials.facebookLink || '',
      instagramLink: socials.instagramLink || '',
      linkedinLink:  socials.linkedinLink || '',
      twitterLink:  socials.twitterLink || ''
    },
    onSubmit: async (values, { setSubmitting }) => {
      const data = {
        ...values,
        userId: authedUser.id
      }
      dispatch(handleAddSocialsLinks(data,()=>{
      setSubmitting(false);
      enqueueSnackbar(t('flash.saveSuccess'), { variant: 'success' });
      }));
      
    }
  });

  const { handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <Card sx={{ p: 3 }}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3} alignItems="flex-end">
            {SOCIAL_LINKS_OPTIONS.map((link) => (
              <TextField
                key={link.value}
                fullWidth
                {...getFieldProps(link.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">{link.icon}</InputAdornment>
                }}
              />
            ))}

            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {t('actions.saveChanges')}
            </LoadingButton>
          </Stack>
        </Form>
      </FormikProvider>
    </Card>
  );
}
