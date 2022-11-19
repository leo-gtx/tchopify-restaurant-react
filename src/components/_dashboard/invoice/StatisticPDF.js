
import PropTypes from 'prop-types';
import { Page, View, Text, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';
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

StatisticPDF.propTypes = {
  reporting: PropTypes.shape({
    carts: PropTypes.arrayOf(PropTypes.object),
    cricterias: PropTypes.object,
  })
};

export default function StatisticPDF({ reporting }) {
    const {t} = useTranslation();
  const { carts, cricterias } = reporting;
  let prevProduct = null;
  let productTotal = 0;
  let productQty = 0;
  let total = 0;
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={[styles.gridContainer, styles.mb40]}>
          <Image source="/static/brand/logo_full.png" style={{ height: 32 }} />
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.h3}>{t('common.statistic')}</Text>
            <Text style={styles.h4} >{ cricterias.startDate && t('history.filter.dateRangeLabel',{ startDate: fDate(cricterias.startDate), endDate: fDate(cricterias.endDate)})}</Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>{t('table.cricterias')}</Text>
            <Text style={styles.body1}>{`${t('table.shop')}: ${cricterias.shop}`}</Text>
            <Text style={styles.body1}>{cricterias.status && `${t('table.status')}: ${cricterias.status}`} </Text> 
            <Text style={styles.body1}>{cricterias.staff && `${t('table.employee')}: ${cricterias.staff}`} </Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>{t('table.product')}</Text>
              </View>
              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>{t('table.quantity')}</Text>
              </View>
              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>{t('table.unitPrice')}</Text>
              </View>
              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>{t('table.total')}</Text>
              </View>
            </View>
          </View>

          <View style={styles.tableBody}>
            {carts.map((item, index) => {
                if(prevProduct === null){
                    prevProduct = item;
                    productTotal += item.subtotal;
                    productQty += item.quantity;
                }else if(prevProduct.id !== item.id){
                    const result = prevProduct;
                    const subtotal = productTotal;
                    const quantity = productQty;
                    total += subtotal;
                    productTotal = 0;
                    productQty = 0;
                    prevProduct = item;
                    productTotal += item.subtotal;
                    productQty += item.quantity;
                    if (index === carts.length -1) total += productTotal;
                    return (
                      <>
                        <View style={styles.tableRow} key={result.id + index}>
                          <View style={styles.tableCell_2}>
                            <Text>{result.name}</Text>
                          </View>
                          <View style={styles.tableCell_3}>
                            <Text style={styles.subtitle2}>{quantity}</Text>
                          </View>
                          <View style={styles.tableCell_3}>
                            <Text>{result.price}</Text>
                          </View>
                          <View style={styles.tableCell_3}>
                            <Text>{subtotal}</Text>
                          </View>
                        </View>
                        {
                          index === carts.length -1 && (
                            <View style={styles.tableRow} key={prevProduct.id + index}>
                              <View style={styles.tableCell_2}>
                                <Text>{prevProduct.name}</Text>
                              </View>
                              <View style={styles.tableCell_3}>
                                <Text style={styles.subtitle2}>{productQty}</Text>
                              </View>
                              <View style={styles.tableCell_3}>
                                <Text>{prevProduct.price}</Text>
                              </View>
                              <View style={styles.tableCell_3}>
                                <Text>{productTotal}</Text>
                              </View>
                            </View>
                          )
                        }
                      </>
                    )
                }else{
                  productTotal += item.subtotal;
                  productQty += item.quantity;
                  if( index === carts.length -1){
                    total+= productTotal;
                    return (
                      <View style={styles.tableRow} key={prevProduct.id + index}>
                        <View style={styles.tableCell_2}>
                          <Text>{prevProduct.name}</Text>
                        </View>
                        <View style={styles.tableCell_3}>
                          <Text style={styles.subtitle2}>{productQty}</Text>
                        </View>
                        <View style={styles.tableCell_3}>
                          <Text>{prevProduct.price}</Text>
                        </View>
                        <View style={styles.tableCell_3}>
                          <Text>{productTotal}</Text>
                        </View>
                      </View>
                    )
                  }
                }
                return null;
            })}

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>{t('invoice.total')}</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(total)}</Text>
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
