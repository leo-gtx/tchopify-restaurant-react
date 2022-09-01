import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik, Form, FormikProvider } from 'formik';
import { useSnackbar } from 'notistack5';
import * as Yup from 'yup';
import { filter, sumBy } from 'lodash';
// material
import { Container, Stack, Paper, useTheme } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// redux
import { useDispatch, useSelector } from 'react-redux';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  ShopProductSort,
  ShopProductList,
  CartList
} from '../../components/_dashboard/pos';
import Scrollbar from '../../components/Scrollbar';

// utils
import { getOwnerId } from '../../utils/utils';
import { fCurrency } from '../../utils/formatNumber';
// hooks
import useSettings from '../../hooks/useSettings';
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
// actions
import { handleGetSubCategories } from '../../redux/actions/category';
import { 
  addCart,
  decreaseQuantity,
  increaseQuantity,
  deleteCart,
  resetCart
 } from '../../redux/actions/app';
import { PosPlaceOrder } from '../../redux/actions/order';
// ----------------------------------------------------------------------

function applyFilter(products, category) {
  // FILTER PRODUCTS
  if (category !== 'All') {
    products = filter(products, (_product) => _product.category === category);
  }
 
  return products;
}

export default function Pos() {
  const {t} = useTranslation();
  const { breakpoints } = useTheme();
  const { themeStretch } = useSettings();
  const { isCollapse } = useCollapseDrawer();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { authedUser, dishes, categories, app, restaurants } = useSelector((state)=>state);
  const shopDishes = Object.values(dishes);
  const shopCategories = [{id: 'all', name: 'All'}, ...Object.values(categories.sub)];
  const [sort, setSort] = useState('All');
  const filteredProducts = applyFilter(shopDishes, sort);
  const { cart } = app.checkout;
  const isEmptyCart = cart.length === 0;
  const total = sumBy(cart, 'subtotal');

  const handleSelectOption = (value)=>{
    setSort(value)
  }

  useEffect(() => {
    dispatch(handleGetSubCategories(getOwnerId(authedUser)));
 }, [dispatch, authedUser]);

 const formik = useFormik({
  validationSchema: Yup.object().shape({
    table: Yup.string().required(t('forms.tableRequired'))
  }),
  enableReinitialize: true,
  initialValues: { products: cart, table: '' },
  onSubmit: (values, { setErrors, setSubmitting }) => {
    const onSuccess = ()=>{
      dispatch(resetCart())
      setSubmitting(true);
      enqueueSnackbar(t('flash.orderPlaced'), { variant: 'success' });
    }
    const onError = (error)=>{
      console.error(error);
      setErrors(error.message);
      setSubmitting(true);
      enqueueSnackbar(t('flash.orderFailure'), { variant: 'error' });
    }
    const data = {
        subtotal: total,
        total,
        discount: 0,
        billing: {
          fullname: authedUser.fullname,
          table: values.table
        },
        from: {
          name: restaurants[authedUser.shop].name,
          owner: getOwnerId(authedUser),
          id: authedUser.shop,
          userId: authedUser.id
        },
        cart: values.products,
        payment: 'cash'
    }
    PosPlaceOrder(data, onSuccess, onError)
  }
});

const handleDeleteCart = useCallback((productId, options) => {
  dispatch(deleteCart(productId, options));
});

const handleIncreaseQuantity = useCallback((productId, options) => {
  dispatch(increaseQuantity(productId, options));
});

const handleDecreaseQuantity = useCallback((productId, options) => {
  dispatch(decreaseQuantity(productId, options));
});

const handleAddCart = (productId)=>{
  const product = shopDishes.find((item)=>item.id === productId);
  const { id, name, image,  price} = product;
  dispatch(addCart({id, name, image, price, quantity: 1, subtotal: price, options: [], shopId: authedUser.shop}))
}

const { handleSubmit, isSubmitting } = formik;
// const totalItems = sum(values.products.map((item) => item.quantity));
const getPadding = ()=>{
  const padding = {};
  if(isCollapse){
    padding[breakpoints.up('md')] = { paddingLeft: 13}
    padding[breakpoints.down('md')] = { paddingLeft: 0}
    padding[breakpoints.only('md')] = { paddingLeft: 0}
  }else{
    padding[breakpoints.up('md')] = { paddingLeft: 35}
    padding[breakpoints.down('md')] = { paddingLeft: 0}
    padding[breakpoints.only('md')] = { paddingLeft: 0}
  }
  
  return padding
};
  return (
    <Page title="Point of Sale | Tchopify Merchant">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('pos.title')}
          links={[
            { name: t('links.dashboard'), href: PATH_DASHBOARD.general.home },
            {
              name: t('links.pos'),
            }
          ]}
        />
          <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-start" sx={{ mb: 5 }}>
              <ShopProductSort options={shopCategories} onSelectOption={handleSelectOption} currentOption={sort} />
          </Stack>
          <FormikProvider value={formik}>
            <Stack spacing={2} sx={{paddingBottom: 20}}>
              <Stack >
                <ShopProductList products={filteredProducts || []} isLoad={!dishes} onSelectProduct={handleAddCart}/>
              </Stack>
              {
                !isEmptyCart && (
                  <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0, height: 240, ...getPadding() }} elevation={3}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <Scrollbar>
                          <CartList formik={formik} onDelete={handleDeleteCart} onDecreaseQuantity={handleDecreaseQuantity} onIncreaseQuantity={handleIncreaseQuantity} />
                        </Scrollbar>
                        <Stack justifyContent='center' alignItems='center'>
                          <LoadingButton
                              size="large"
                              type="submit"
                              variant="contained"
                              sx={{ whiteSpace: 'nowrap' }}
                              loading={isSubmitting}
                            >
                              Total {fCurrency(total)}
                            </LoadingButton>
                        </Stack>
                    </Form>
                  </Paper>
                )}  
            </Stack>
          </FormikProvider>
          
       
        
      </Container>
    </Page>
  );
}
