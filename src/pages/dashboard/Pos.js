import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useFormik, Form, FormikProvider } from 'formik';
import { useSnackbar } from 'notistack5';
import * as Yup from 'yup';
import { filter, sumBy } from 'lodash';
import { Icon } from '@iconify/react';
// material
import { Container, Stack, Paper, useTheme, Tooltip, Button } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import checkmarkFill from '@iconify/icons-eva/checkmark-fill';
import closeFill from '@iconify/icons-eva/close-fill';
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
import { handleGetDishes } from '../../redux/actions/dishes';
import { 
  addCart,
  decreaseQuantity,
  increaseQuantity,
  deleteCart,
  resetCart
 } from '../../redux/actions/app';
import { PosPlaceOrder, PosEditOrder } from '../../redux/actions/order';
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
  const navigator = useNavigate();
  const { authedUser, dishes, categories, app, restaurants } = useSelector((state)=>state);
  const shopDishes = Object.values(dishes);
  const shopCategories = [{id: 'all', name: 'All'}, ...Object.values(categories.sub)];
  const [sort, setSort] = useState('All');
  const filteredProducts = applyFilter(shopDishes, sort);
  const { cart, orderId, billing } = app.checkout;
  const isEdit = !!orderId;
  const isEmptyCart = cart.length === 0;
  const total = sumBy(cart, 'subtotal');
  const [open, setOpen] = useState(false);
  const handleOpenModal  = ()=> setOpen(true);
  const handleCloseModal = ()=> setOpen(false);

  const handleSelectOption = (value)=>{
    setSort(value)
  }

  useEffect(() => {
    dispatch(handleGetSubCategories(getOwnerId(authedUser)));
    dispatch(handleGetDishes(getOwnerId(authedUser)));
 }, [dispatch, authedUser]);

 const formik = useFormik({
  validationSchema: Yup.object().shape({
    table: Yup.string(),
  }),
  enableReinitialize: true,
  initialValues: { products: cart, table: billing?.table || '' },
  onSubmit: (values, { setErrors, setSubmitting }) => {
    const onSuccess = ()=>{
      dispatch(resetCart())
      setSubmitting(true);
      enqueueSnackbar(!isEdit ? t('flash.orderPlaced'):t('flash.orderEdit'), { variant: 'success' });
      navigator(PATH_DASHBOARD.order.posOrders);
    }
    const onError = (error)=>{
      console.error(error);
      setErrors(error.message);
      setSubmitting(true);
      enqueueSnackbar(!isEdit ? t('flash.orderFailure'):t('flash.orderEditFailure'), { variant: 'error' });
    }
    const data = {
        id: orderId,
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
    if (!isEdit ) PosPlaceOrder(data, onSuccess, onError)
    else PosEditOrder(data, onSuccess, onError)
  }
});

const handleResetCart = useCallback(() => {
  dispatch(resetCart())
},[dispatch])

const handleDeleteCart = useCallback((productId, options) => {
  dispatch(deleteCart(productId, options));
},[dispatch]);

const handleIncreaseQuantity = useCallback((productId, options) => {
  dispatch(increaseQuantity(productId, options));
},[dispatch]);

const handleDecreaseQuantity = useCallback((productId, options) => {
  dispatch(decreaseQuantity(productId, options));
},[dispatch]);

const handleAddCart = useCallback((productId)=>{
  const product = shopDishes.find((item)=>item.id === productId);
  const { id, name, image,  price} = product;
  dispatch(addCart({id, name, image, price, quantity: 1, subtotal: price, options: [], shopId: authedUser.shop}))
},[dispatch, shopDishes, authedUser]);

const { isSubmitting } = formik;
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
      <FormikProvider value={formik}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? t('pos.title'):t('pos.edit', {order: orderId})}
          links={[
            { name: t('links.dashboard'), href: PATH_DASHBOARD.general.home },
            {
              name: !isEdit ? t('links.pos'):t('pos.edit', {order: orderId}),
            }
          ]}
        />
          <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-start" sx={{ mb: 5 }}>
              <ShopProductSort options={shopCategories} onSelectOption={handleSelectOption} currentOption={sort} />
          </Stack>
          
            <Stack spacing={2} sx={{paddingBottom: 20}}>
              <Stack >
                <ShopProductList products={filteredProducts || []} isLoad={!dishes} onSelectProduct={handleAddCart}/>
              </Stack>
              {
                !isEmptyCart && (
                  <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0, height: 240, ...getPadding() }} elevation={3}>
                    <Form 
                      autoComplete="off" 
                      noValidate 
                      onSubmit={(e)=>{
                        e.preventDefault();
                        handleOpenModal();
                      }}
                      >
                        <Scrollbar>
                          <CartList formik={formik} onCloseModal={handleCloseModal} openModal={open} onDelete={handleDeleteCart} onDecreaseQuantity={handleDecreaseQuantity} onIncreaseQuantity={handleIncreaseQuantity} />
                        </Scrollbar>
                        <Stack direction='row' justifyContent='center' alignItems='center' spacing={2}>
                          {
                            !isSubmitting && (
                              <Tooltip title={t('actions.cancel')} placement='left'>
                                <Button
                                size='large'
                                color='primary'
                                variant="outlined"
                                sx={{ whiteSpace: 'nowrap' }}
                                onClick={handleResetCart}
                                >
                                  <Icon icon={closeFill} width={24} height={24}/>
                                </Button>
                            </Tooltip>
                            )
                          }
                          <Tooltip title={`Total: ${fCurrency(total)}`}  placement='right' >
                            <LoadingButton
                                size="large"
                                type="submit"
                                color='success'
                                variant="outlined"
                                sx={{ whiteSpace: 'nowrap' }}
                                loading={isSubmitting}
                              >
                                <Icon icon={checkmarkFill} width={24} height={24} />
                              </LoadingButton>
                          </Tooltip>
                        </Stack>
                    </Form>
                  </Paper>
                )}  
            </Stack>
      </Container>
      </FormikProvider>
    </Page>
  );
}
