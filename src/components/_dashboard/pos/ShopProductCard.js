import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import roundAddShoppingCart from '@iconify/icons-ic/round-add-shopping-cart';
// material
import { Box, Card, Typography, Stack, Button } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
  onSelectProduct: PropTypes.func
};

export default function ShopProductCard({ product, onSelectProduct }) {
  const {t} = useTranslation();
  const { name, image, price, id  } = product;
  const handleSelectProduct = ()=>
    onSelectProduct(id)
  return (
      <Card>
        <Box sx={{ pt: '100%', position: 'relative' }}>
          <ProductImgStyle alt={name} src={image} />
        </Box>
        <Stack spacing={2} sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle1" noWrap>
                {name}
              </Typography>
              <Typography variant="subtitle1">
              {fCurrency(price)}
              </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="flex-start">
          <Button
              fullWidth
              size="large"
              type="button"
              color="warning"
              variant="contained"
              startIcon={<Icon icon={roundAddShoppingCart} />}
              onClick={handleSelectProduct}
              sx={{ whiteSpace: 'nowrap' }}
            >
              {t('actions.addToCart')}
            </Button>
          </Stack>
        </Stack>
      </Card>
  );
}
