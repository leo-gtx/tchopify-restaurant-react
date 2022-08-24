import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { LoadingButton } from '@material-ui/lab';
import { useSnackbar } from 'notistack5';
import { useTranslation } from 'react-i18next';
// material
import { styled } from '@material-ui/core/styles';
import { InputAdornment, TextField, Button, Card, Typography, Stack, DialogActions, DialogTitle, DialogContent, Alert } from '@material-ui/core';
// 
import { DialogAnimate } from '../../animate';
import { CheckoutPaymentMethods } from '../checkout';
import Scrollbar from '../../Scrollbar';
// actions
import { handleWithdrawMoney, handleVerifyUser } from '../../../redux/actions/authedUser';
// utils
import { fCurrency } from '../../../utils/formatNumber';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { getOwnerId } from '../../../utils/utils';

// ----------------------------------------------------------------------
const RowStyle = styled('div')({
  display: 'flex',
  justifyContent: 'space-between'
});

const PAYMENT_OPTIONS = [
  {
    value: 'mobile_money',
    title: 'Mobile Money',
    service: '1',
    description: 'forms.momoDescription',
    icons: ['/static/icons/ic_mobile_money.svg']
  },
  {
    value: 'orange_money',
    title: 'Orange Money',
    service: '2',
    description: 'forms.omDescription',
    icons: ['/static/icons/ic_orange_money.svg']
  },
  {
    value: 'eu_mobile_money',
    title: 'EU Mobile Money',
    service: '5',
    description: 'forms.euDescription',
    icons: ['/static/icons/ic_eu_mobile_money.png']
  }
];

// ----------------------------------------------------------------------

export default function EcommerceCurrentBalance() {
  const {t} = useTranslation()
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const code = queryParams.get('code');
  const amount = queryParams.get('amount');
  const phoneNumber = queryParams.get('phoneNumber');
  const payment = queryParams.get('payment');
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authedUser = useSelector((state)=>state.authedUser);
  const { balance, rewards } = authedUser;
  const commission = (balance * 3 / 100);
  const totalAmount = balance - commission + rewards;
  const PaymentSchema = Yup.object().shape({
    payment: Yup.mixed().required(t('forms.paymentRequired')),
    amount: Yup.number().min(500, t('forms.amountMin')).max(300000, t('forms.amountMax')).required(t('forms.amountRequired')),
    phoneNumber: Yup.string().when("payment",{
      is: (payment) => payment !== 'pay_at_delivery',
      then: Yup.string().required(t('forms.phoneNumberRequired'))
    })
  });

  const formik = useFormik({
    initialValues: {
      payment: '',
      amount: 500,
      phoneNumber: ''
    },
    validationSchema: PaymentSchema,
    onSubmit: (values, { setErrors, setSubmitting }) => {
      const data ={
        userId: getOwnerId(authedUser),
        ...values
      };
      const callback = ()=>{
        enqueueSnackbar(t('flash.withdrawMailSent'), {variant: 'info'})
      };
      handleVerifyUser(data, callback);
    }
  });



  const {isSubmitting, handleSubmit, getFieldProps, errors, touched, setSubmitting} = formik;
  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  useEffect(()=>{
    const onError = (error)=>{
      console.error(error);
      enqueueSnackbar( error || t('flash.withdrawFail'), {variant: 'error'});
      setSubmitting(false);
      navigate(PATH_DASHBOARD.root);
    };

    const onSuccess = ()=>{
      enqueueSnackbar(t('flash.withdrawDone'), {variant: 'success'});
      handleCloseModal();
      setSubmitting(false);
      navigate(PATH_DASHBOARD.root);
    };


    if(code && phoneNumber && amount && payment){
      const data =  {
        code,
        wallet: phoneNumber,
        amount: Number(amount),
        service: PAYMENT_OPTIONS.find((item)=>item.value === payment).service,
        userId: getOwnerId(authedUser)
      }
      handleOpenModal()
      setSubmitting(true)
      dispatch(handleWithdrawMoney(data, onSuccess, onError))
    } 
  },[code, phoneNumber, amount, payment])

  return (
    <FormikProvider value={formik}>
    <Card sx={{ p: 3 }}>
      <Typography variant="subtitle2" gutterBottom>
        {t('dashboard.balanceTitle')}
      </Typography>

      <Stack spacing={2}>
        <Typography variant="h3">{fCurrency(balance)}</Typography>

        <RowStyle>
          <Typography variant="body2"  sx={{ color: 'text.secondary' }}>
            {t('dashboard.commissionLabel')}
          </Typography>
          <Typography variant="body2">- {fCurrency(commission)}</Typography>
        </RowStyle>

        <RowStyle>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('dashboard.rewardsLabel')}
          </Typography>
          <Typography variant="body2" color='green'>{fCurrency(rewards)}</Typography>
        </RowStyle>

        <RowStyle>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('dashboard.withdrawableAmount')}                    
          </Typography>
          <Typography variant="subtitle1">{fCurrency(totalAmount)}</Typography>
        </RowStyle>

        <Stack direction="row" spacing={1.5}>
          <Button fullWidth variant="contained" color="warning" onClick={handleOpenModal}>
          {t('actions.withdraw')}
          </Button>
        </Stack>
      </Stack>
    </Card>
    <DialogAnimate  onClose={handleCloseModal} open={open} >
     
          <Form  autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Scrollbar>
              <DialogTitle>{t('dashboard.withdrawTitle')}</DialogTitle>
              <DialogContent >
                
                <Stack>
                  <TextField
                    fullWidth
                    label={t('forms.amountLabel')}
                    placeholder='000'
                    InputProps={{
                      startAdornment: <InputAdornment position="start">XAF</InputAdornment>,
                      type: 'number'
                    }}
                    {...getFieldProps('amount')}
                    error={Boolean(touched.amount && errors.amount)}
                    helperText={touched.amount && errors.amount}
                    sx={{ marginBottom: 2, marginTop: 2 }}
                  />
                </Stack>
                    
                <Stack>
                  <CheckoutPaymentMethods formik={formik} paymentOptions={PAYMENT_OPTIONS} />
                </Stack>
                { isSubmitting && (<Alert color='info'>{t('flash.withdrawMailAlert')}</Alert>)}
              </DialogContent>
              <DialogActions>
              <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                {t('actions.withdraw')}
              </LoadingButton>
              </DialogActions>
            </Scrollbar>
          </Form>
      </DialogAnimate>
    </FormikProvider>
  );
}
