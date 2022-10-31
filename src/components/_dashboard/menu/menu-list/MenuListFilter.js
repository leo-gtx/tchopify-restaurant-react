import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Form, FormikProvider } from 'formik';
import { useTranslation } from 'react-i18next';
import closeFill from '@iconify/icons-eva/close-fill';
import roundClearAll from '@iconify/icons-ic/round-clear-all';
import roundFilterList from '@iconify/icons-ic/round-filter-list';
// material
import {
  Box,
  Radio,
  Stack,
  Button,
  Drawer,
  Rating,
  Divider,
  Typography,
  RadioGroup,
  FormControlLabel
} from '@material-ui/core';
//
import { MIconButton } from '../../../@material-extend';
import Scrollbar from '../../../Scrollbar';


// ----------------------------------------------------------------------

export const FILTER_RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];
export const FILTER_PRICE_OPTIONS = [
  { value: 'below', label: 'dishList.filter.below' },
  { value: 'between', label: 'dishList.filter.between' },
  { value: 'above', label: 'dishList.filter.above' }
];


// ----------------------------------------------------------------------

MenuListFilter.propTypes = {
  isOpenFilter: PropTypes.bool,
  onResetFilter: PropTypes.func,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
  formik: PropTypes.object,
  categories: PropTypes.array,
};

export default function MenuListFilter({ isOpenFilter, onResetFilter, onOpenFilter, onCloseFilter, formik, categories }) {
  const {t} = useTranslation();
  const { values, getFieldProps } = formik;
  return (
    <>

      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate>
          <Drawer
            anchor="right"
            open={isOpenFilter}
            onClose={onCloseFilter}
            PaperProps={{
              sx: { width: 280, border: 'none', overflow: 'hidden' }
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
              <Typography variant="subtitle1" sx={{ ml: 1 }}>
                {t('dishList.filter.title')}
              </Typography>
              <MIconButton onClick={onCloseFilter}>
                <Icon icon={closeFill} width={20} height={20} />
              </MIconButton>
            </Stack>

            <Divider />

            <Scrollbar>
              <Stack spacing={3} sx={{ p: 3 }}>

                <div>
                  <Typography variant="subtitle1" gutterBottom>
                    {t('dishList.filter.category')}
                  </Typography>
                  <RadioGroup {...getFieldProps('category')}>
                  <FormControlLabel value='all' control={<Radio />} label={t('dishList.filter.all')} />
                    {categories.map((item) => (
                      <FormControlLabel key={item.id} value={item.name} control={<Radio />} label={item.name} />
                    ))}
                  </RadioGroup>
                </div>


                <div>
                  <Typography variant="subtitle1" gutterBottom>
                  {t('dishList.filter.price')}
                  </Typography>
                  <RadioGroup {...getFieldProps('priceRange')}>
                    {FILTER_PRICE_OPTIONS.map((item) => (
                      <FormControlLabel key={item.value} value={item.value} control={<Radio />} label={t(item.label)} />
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Typography variant="subtitle1" gutterBottom>
                  {t('dishList.filter.rating')}
                  </Typography>
                  <RadioGroup {...getFieldProps('rating')}>
                    {FILTER_RATING_OPTIONS.map((item, index) => (
                      <FormControlLabel
                        key={item}
                        value={item}
                        control={
                          <Radio
                            disableRipple
                            color="default"
                            icon={<Rating readOnly value={4 - index} />}
                            checkedIcon={<Rating readOnly value={4 - index} />}
                            sx={{
                              '&:hover': { bgcolor: 'transparent' }
                            }}
                          />
                        }
                        label="& Up"
                        sx={{
                          my: 0.5,
                          borderRadius: 1,
                          '&:hover': { opacity: 0.48 },
                          ...(values.rating.includes(item) && {
                            bgcolor: 'action.selected'
                          })
                        }}
                      />
                    ))}
                  </RadioGroup>
                </div>
              </Stack>
            </Scrollbar>

            <Box sx={{ p: 3 }}>
              <Button
                fullWidth
                size="large"
                type="submit"
                color="inherit"
                variant="outlined"
                onClick={onResetFilter}
                startIcon={<Icon icon={roundClearAll} />}
              >
                {t('actions.clearAll')}
              </Button>
            </Box>
          </Drawer>
        </Form>
      </FormikProvider>
    </>
  );
}
