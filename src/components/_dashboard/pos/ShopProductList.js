import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
// material
import { Skeleton, Grid } from '@material-ui/core';
import ShopProductCard from './ShopProductCard';
import EmptyContent from '../../EmptyContent';

// ----------------------------------------------------------------------

const SkeletonLoad = (
  <Grid container spacing={3}>
    {[...Array(12)].map((_, index) => (
      <Grid item xs={12} sm={4} md={2} key={index}>
        <Skeleton variant="rectangular" width="100%" sx={{ paddingTop: '115%', borderRadius: 2 }} />
      </Grid>
    ))}
  </Grid>
);

ProductList.propTypes = {
  products: PropTypes.array.isRequired,
  isLoad: PropTypes.bool,
  onSelectProduct: PropTypes.func
};

export default function ProductList({ products, isLoad, onSelectProduct, ...other }) {
  const {t} = useTranslation();
  return (
    <>
      {isLoad && SkeletonLoad}
      <Grid container spacing={3} {...other}>
        {products.map((product) => (
          <Grid key={product.id} item xs='auto'>
            <ShopProductCard product={product} onSelectProduct={onSelectProduct} />
          </Grid>
        ))}
      </Grid>

        
        { !isLoad && products.length < 1 && (
        <EmptyContent
         title={t('shopDetails.emptyContent')}
         img='/static/illustrations/illustration_empty_content.svg'
        />
      )}
      
    </>
   
  );
}
