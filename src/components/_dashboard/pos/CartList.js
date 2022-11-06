import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import plusFill from '@iconify/icons-eva/plus-fill';
import minusFill from '@iconify/icons-eva/minus-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
// material
import { styled } from '@material-ui/core/styles';
import {
  Box,
  Stack,
  Divider,
  Typography,
  useTheme,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@material-ui/core';
// components
import { DialogAnimate } from '../../animate';
// utils
import { fCurrency } from '../../../utils/formatNumber';
//
import { MIconButton } from '../../@material-extend';


// ----------------------------------------------------------------------

const IncrementerStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(0.5, 0.75),
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${theme.palette.grey[500_32]}`
}));

const ThumbImgStyle = styled('img')(({ theme }) => ({
  width: 64,
  height: 64,
  objectFit: 'cover',
  marginRight: theme.spacing(2),
  borderRadius: theme.shape.borderRadiusSm
}));

// ----------------------------------------------------------------------

Incrementer.propTypes = {
  quantity: PropTypes.number,
  onIncrease: PropTypes.func,
  onDecrease: PropTypes.func
};

function Incrementer({ quantity, onIncrease, onDecrease }) {
  return (
    <Box sx={{ width: 96, textAlign: 'right' }}>
      <IncrementerStyle>
        <MIconButton size="small" color="inherit" onClick={onDecrease} disabled={quantity <= 1}>
          <Icon icon={minusFill} width={16} height={16} />
        </MIconButton>
        {quantity}
        <MIconButton size="small" color="inherit" onClick={onIncrease} >
          <Icon icon={plusFill} width={16} height={16} />
        </MIconButton>
      </IncrementerStyle>
      
    </Box>
  );
}

CartList.propTypes = {
  formik: PropTypes.object.isRequired,
  onDelete: PropTypes.func,
  onDecreaseQuantity: PropTypes.func,
  openModal: PropTypes.bool.isRequired,
  onIncreaseQuantity: PropTypes.func,
  onCloseModal: PropTypes.func,
};

export default function CartList({ formik, onDelete, onIncreaseQuantity, onDecreaseQuantity, openModal, onCloseModal }) {
  const { products } = formik.values;
  const { getFieldProps, handleSubmit  } = formik;
  const {t} = useTranslation();
  const { palette } = useTheme();
  return (
      <Stack direction='row' divider={<Divider orientation='vertical' variant='middle' flexItem />}>

          {products.map((product) => {
            const { id, name, options, image, quantity, subtotal } = product;
            return (
              <Stack sx={{mt: 2, ml:2, mr: 2}} key={id}>

                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', position: 'relative'}}>
                      <Box>
                        <ThumbImgStyle alt="product image" src={image} />
                      </Box>
                      <Box sx={{ position: 'absolute', right: 0, top: -14, backgroundColor: palette.background.default, borderRadius: 10 }}>
                        <MIconButton onClick={() => onDelete(id, options)}>
                          <Icon icon={trash2Fill} width={20} height={20} color={palette.primary.main} />
                        </MIconButton>
                      </Box>
                    </Box>
                    
                    <Box>
                      <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240, mb: 0.5 }}>
                        {name}
                      </Typography>
                      { options?.length > 0 && (
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          divider={<Divider orientation="vertical" sx={{ height: 14, alignSelf: 'center' }} />}
                        >
                            <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                              {t('table.options')}:
                            </Typography>
                            {options.map((item, index)=>(
                              <Typography key={index} variant="body2">{item}</Typography>
                            ))}

                        </Stack>
                      )}
                      
                    </Box>
                    <Box>
                      <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240, mb: 0.5 }}>
                        {fCurrency(subtotal)}
                      </Typography>
                    </Box>
                    <Box>
                      <Incrementer
                      quantity={quantity}
                      onDecrease={() => onDecreaseQuantity(id, options)}
                      onIncrease={() => onIncreaseQuantity(id, options)}
                      />
                    </Box>
                    
                  </Box>
              </Stack>
            );
          })}
          <Stack sx={{m: 2}} justifyContent='center'>
           
            <DialogAnimate open={openModal} onClose={onCloseModal}>
              <DialogTitle>{t('pos.modalTableTitle')}</DialogTitle>
              <DialogContent>
                <TextField
                fullWidth
                label={t('forms.tableLabel')}
                {...getFieldProps('table')}
                />
              </DialogContent>
              <DialogActions>
                <Button 
                variant='outlined' 
                onClick={()=>{
                  handleSubmit();
                  onCloseModal();
                }}
                >
                {t('actions.confirm')}
                </Button>
              </DialogActions>
            </DialogAnimate>
          </Stack>
      </Stack>
  );
}
