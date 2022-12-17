import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
// import { useTranslation } from 'react-i18next';
import roundAddShoppingCart from '@iconify/icons-ic/round-add-shopping-cart';
// material
import { Box, Card, Typography, Stack, Button, Grid } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '130px',
  objectFit: 'cover',
  position: 'absolute'
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
  onSelectProduct: PropTypes.func
};

export default function ShopProductCard({ product, onSelectProduct }) {
  // const {t} = useTranslation();
  const { name, image, price, id  } = product;
  const handleSelectProduct = ()=>
    onSelectProduct(id)
  return (
      <Card onClick={handleSelectProduct}>
        <Box sx={{ pt: '100%', position: 'relative'}}>
          <ProductImgStyle alt={name} src={ image || '/static/illustrations/illustration_dish.jpg'} />
        </Box>
        <Stack  spacing={2} sx={{ p: 3 }}>
          <Grid container direction="column"  justifyContent="space-between">
            <Grid item >
              <Typography variant="subtitle1">
                {name}
              </Typography>
            </Grid>
              <Grid item>
                <Typography variant="subtitle1">
                {fCurrency(price)}
                </Typography>
              </Grid>
              
          </Grid>
          <Stack direction="row" alignItems="center" justifyContent="flex-start">
          <Button
              fullWidth
              size="large"
              type="button"
              color="warning"
              variant="contained"
              startIcon={<Icon icon={roundAddShoppingCart} />}
              sx={{ whiteSpace: 'nowrap' }}
            />
          </Stack>
        </Stack>
      </Card>
  );
}
