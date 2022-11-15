
import PropTypes from 'prop-types';
import { Page, View, Text, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';
import { sumBy } from 'lodash';
import { useTranslation } from 'react-i18next';
// utils
import { fCurrency } from '../../../utils/formatNumber';
import { fDate } from '../../../utils/formatTime';
// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }]
});

const styles = StyleSheet.create({
  col4: { width: '25%' },
  col8: { width: '75%' },
  col6: { width: '50%' },
  mb8: { marginBottom: 8 },
  mb40: { marginBottom: 40 },
  overline: {
    fontSize: 8,
    marginBottom: 8,
    fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: 'uppercase'
  },
  h3: { fontSize: 16, fontWeight: 700 },
  h4: { fontSize: 13, fontWeight: 700 },
  body1: { fontSize: 10 },
  subtitle2: { fontSize: 9, fontWeight: 700 },
  alignRight: { textAlign: 'right' },
  page: {
    padding: '40px 24px 24px 24px',
    fontSize: 9,
    lineHeight: 1.6,
    fontFamily: 'Roboto',
    backgroundColor: '#fff',
    textTransform: 'capitalize'
  },
  footer: {
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
    margin: 'auto',
    borderTopWidth: 1,
    borderStyle: 'solid',
    position: 'absolute',
    borderColor: '#DFE3E8'
  },
  gridContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  table: { display: 'flex', width: 'auto' },
  tableHeader: {},
  tableBody: {},
  tableRow: {
    padding: '8px 0',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#DFE3E8'
  },
  noBorder: { paddingTop: 8, paddingBottom: 0, borderBottomWidth: 0 },
  tableCell_1: { width: '5%' },
  tableCell_2: { width: '50%', paddingRight: 16 },
  tableCell_3: { width: '15%' }
});

// ----------------------------------------------------------------------

ReportingPDF.propTypes = {
  reporting: PropTypes.shape({
    orders: PropTypes.arrayOf(PropTypes.object),
    cricterias: PropTypes.object
  })
};

export default function ReportingPDF({ reporting }) {
    const {t} = useTranslation();
  const { orders, cricterias } = reporting;
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={[styles.gridContainer, styles.mb40]}>
          <Image source="/static/brand/logo_full.png" style={{ height: 32 }} />
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.h3}>{t('common.reporting')}</Text>
            <Text style={styles.h4} >{ cricterias.startDate && t('history.filter.dateRangeLabel',{ startDate: fDate(cricterias.startDate), endDate: fDate(cricterias.endDate)})}</Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>{t('table.cricterias')}</Text>
            <Text style={styles.body1}>{`${t('table.shop')}: ${cricterias.shop}`}</Text>
            <Text style={styles.body1}>{cricterias.status && `${t('table.status')}: ${cricterias.status}`} </Text> 
            <Text style={styles.body1}>{cricterias.staff &&`${t('table.employee')}: ${cricterias.staff}`} </Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>{t('table.date')}</Text>
              </View>
              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>{t('table.orderId')}</Text>
              </View>
              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>{t('table.amount')}</Text>
              </View>
              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>{t('table.status')}</Text>
              </View>
              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>{t('table.paid')}</Text>
              </View>
            </View>
          </View>

          <View style={styles.tableBody}>
            {orders.map((item, index) => (
              <View style={styles.tableRow} key={item.id + index}>
                <View style={styles.tableCell_3}>
                  <Text>{new Date(item.orderAt).toLocaleDateString()}</Text>
                </View>
                <View style={styles.tableCell_2}>
                  <Text style={styles.subtitle2}>#{item.id}</Text>
                </View>
                <View style={styles.tableCell_3}>
                  <Text>{item.total}</Text>
                </View>
                <View style={styles.tableCell_3}>
                  <Text>{item.status.toUpperCase()}</Text>
                </View>
                <View style={styles.tableCell_3}>
                  <Text>{item.paymentStatus === 'paid'? t('common.yes'):t('common.no')}</Text>
                </View>
              </View>
            ))}

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>{t('invoice.total')}</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(sumBy(orders, (order)=>order.total))}</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>{t('invoice.totalCompleted')}</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(sumBy(orders.filter((order)=>order.status === 'completed'), (order)=>order.total))}</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>{t('invoice.totalPaid')}</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(sumBy(orders.filter((order)=>order.paymentStatus === 'paid'), (order)=>order.total))}</Text>
              </View>
            </View>
          </View>
        </View>

        { /* <View style={[styles.gridContainer, styles.footer]}>
          <View style={styles.col8}>
            <Text style={styles.subtitle2}>NOTES</Text>
            <Text>We appreciate your business. Should you need us to add VAT or extra notes let us know!</Text>
          </View>
          <View style={[styles.col4, styles.alignRight]}>
            <Text style={styles.subtitle2}>Have a Question?</Text>
            <Text>support@tchopify.com</Text>
          </View>
        </View>
            */}
      </Page>
    </Document>
  );
}
