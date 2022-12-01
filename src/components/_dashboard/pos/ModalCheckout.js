import {
    Button,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Tab,
    Tabs,
    Stack,
    Box,
} from '@material-ui/core';
import { Icon } from '@iconify/react';
import { capitalCase } from 'change-case';
import squareFill from '@iconify/icons-eva/square-fill';
import moneyFill from '@iconify/icons-ant-design/credit-card-fill';
import CreditScoreIcon from '@material-ui/icons/CreditScore';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
// components
import { DialogAnimate } from '../../animate';
import { CheckoutPaymentMethods } from '../checkout';
//----------------------------------------------------------------------------

const TableView = ({formik})=>{
    const {t} = useTranslation();
    const { getFieldProps } = formik;
    return(
        <TextField
                fullWidth
                label={t('forms.tableLabel')}
                {...getFieldProps('table')}
        />
    )
}
TableView.propTypes = {
    formik: PropTypes.object
}
//---------------------------------------------------------------------------
const PAYMENT_OPTIONS = [
    {
        value: 'cash',
        title: 'Cash',
        service: '0',
        description: '',
        note: 'forms.cashNote',
        icons: ['/static/icons/ic_payment.svg']
    },
    {
      value: 'mobile_money',
      title: 'Mobile Money',
      service: '1',
      description: '',
      note: 'forms.momoNote',
      icons: ['/static/icons/ic_mobile_money.svg']
    },
    {
      value: 'orange_money',
      title: 'Orange Money',
      service: '2',
      description: '',
      note: 'forms.omNote',
      icons: ['/static/icons/ic_orange_money.svg']
    },
    {
      value: 'eu_mobile_money',
      title: 'EU Mobile Money',
      service: '5',
      description: '',
      icons: ['/static/icons/ic_eu_mobile_money.png']
    }
  ];
//---------------------------------------------------------------------------

ModalCheckout.propTypes = {
    formik: PropTypes.object.isRequired,
    openModal: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func,
};

export default function ModalCheckout({ formik, openModal, onCloseModal }){
    const [currentTab, setCurrentTab] = useState('table');
    const { handleSubmit } = formik;
    const { paymentStatus } = useSelector((state)=>state.app.checkout)
    const {t} = useTranslation();
    const isPaid = paymentStatus === 'paid';
    const CHECKOUT_TABS = [
        {
            value: 'table',
            icon: <Icon icon={squareFill} width={20} height={20} />,
            component: <TableView formik={formik} />
        },
        {
            value: isPaid? t('common.paid'):'payment',
            disabled: isPaid,
            icon: !isPaid?
            <Icon icon={moneyFill} width={20} height={20}/>:
            <CreditScoreIcon/>,
            component: <CheckoutPaymentMethods 
                            formik={formik} 
                            paymentOptions={PAYMENT_OPTIONS} 
                            isGiftCard
                        />
        },
    ];
    const handleChangeTab = (event, newValue) => {
        setCurrentTab(newValue);
      };
    return(
        <DialogAnimate open={openModal} onClose={onCloseModal} >
              <DialogTitle>{t('pos.modalTitle')}</DialogTitle>
              <DialogContent>
                <Stack spacing={5}>
                    <Tabs
                        value={currentTab}
                        scrollButtons="auto"
                        variant="scrollable"
                        allowScrollButtonsMobile
                        onChange={handleChangeTab}
                    >
                        {CHECKOUT_TABS.map((tab) => (
                        <Tab 
                          disableRipple 
                          key={tab.value} 
                          label={capitalCase(tab.value)} 
                          icon={tab.icon} 
                          value={tab.value}
                          disabled={tab?.disabled}
                        />
                        ))}
                    </Tabs>

                    {CHECKOUT_TABS.map((tab) => {
                        const isMatched = tab.value === currentTab;
                        return isMatched && <Box key={tab.value}>{tab.component}</Box>;
                    })}
                </Stack>
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
    )
}