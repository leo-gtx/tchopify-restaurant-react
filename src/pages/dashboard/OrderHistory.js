import { useFormik } from 'formik';
import { filter, sortBy } from 'lodash';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// material
import { useTheme } from '@material-ui/core/styles';
import {
  Box,
  Card,
  Table,
  TableRow,
  Checkbox,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Backdrop,
  CircularProgress
} from '@material-ui/core';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { GetOrdersByOwner } from '../../redux/actions/order';
import { handleGetRestaurants } from '../../redux/actions/restaurant';
import { handleGetStaffs } from '../../redux/actions/staffs';
// utils
import fakeRequest from '../../utils/fakeRequest';
import { fDate } from '../../utils/formatTime';
import { fCurrency } from '../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
    OrderListHead,
    OrderMoreMenu,
    OrderListToolbar,
    OrderListFilter,
    OrderTagFiltered
} from '../../components/_dashboard/order/order-list';
import { ReportingToolbar } from '../../components/_dashboard/invoice';
// utils
import { getOwnerId } from '../../utils/utils';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'username', label: 'table.user', alignRight: false },
  { id: 'name', label: 'table.shop', alignRight: false },
  { id: 'mode', label: 'table.mode', alignRight: false },
  { id: 'total', label: 'table.price', alignRight: false },
  { id: 'paymentStatus', label: 'table.paymentStatus', alignRight: false},
  { id: 'status', label: 'table.status', alignRight: false },
  { id: 'orderAt', label: 'table.orderAt', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

function applyFilter(orders, filters) {
  // FILTER PRODUCTS
  if (filters?.shop !== 'all') {
    orders = filter(orders, (_order) => _order.from.name === filters.shop);
  }
  if (filters.startDate && filters.endDate) {
    orders = filter(orders, (_order) => _order.orderAt >= filters.startDate && _order.orderAt <= filters.endDate
  );
  }
  if (filters?.status) {
    orders = filter(orders, (_order) => filters.status === _order.status); 
  }
  if (filters?.staff) {
    orders = filter(orders, (_order) => _order.from.userId === filters.staff);
  }
  return orders;
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  if (query) {
    return filter(array, (_order) => (_order.from.name.toLowerCase().indexOf(query.toLowerCase()) !== -1) || (_order.status.toLowerCase().indexOf(query.toLowerCase()) !== -1));
  }

  return stabilizedThis.map((el) => el[0]);
}

// ----------------------------------------------------------------------

export default function OrderHistory() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const {authedUser, staffs, restaurants } = useSelector(state=>state);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('orderAt');
  const [openFilter, setOpenFilter] = useState(false);
  const owner = getOwnerId(authedUser)

  useEffect(() => {
     GetOrdersByOwner(owner, (data)=>setOrders(Object.values(data)));
     dispatch(handleGetRestaurants(owner));
     dispatch(handleGetStaffs(owner));
  }, [owner, dispatch, setOrders]);

  const formik = useFormik({
    initialValues: {
      startDate: '',
      endDate: '',
      shop: 'all',
      staff: '',
      status: ''
    },
    onSubmit: async(values, {setSubmitting, resetForm, setValues})=>{
      try {
        await fakeRequest(500);
        resetForm();
        setValues({shop: 'all', startDate: '', endDate: '', staff: '', status: ''})
        setOpenFilter(false)
        setSubmitting(false);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  })
  
  const { values, handleSubmit, isSubmitting} = formik;

  const isDefault =
  values.shop === 'all' &&
  !values.staff &&
  !values.status &&
  !values.start &&
  !values.end

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      if(selected.length === 0){
        const newSelecteds = filteredOrders.map((n) => n.id);
        setSelected(newSelecteds);
        return;
      }
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    handleSubmit();
  };


  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orders.length) : 0;

  const filteredOrders = applySortFilter(applyFilter(orders, values), getComparator(order, orderBy), filterName);

  const selectedOrders = orders.filter((order)=>selected.includes(order.id))

  const isOrderNotFound = filteredOrders.length === 0;

  const reporting = {
    orders: selectedOrders.length > 0 ? sortBy(selectedOrders, (order)=>order.orderAt, 'asc') : sortBy(filteredOrders, (order)=>order.orderAt, 'asc') ,
     cricterias: values
  }

  return (
    <Page title="Store: Order History | Tchopify">
      {values && (
        <Backdrop open={isSubmitting} sx={{ zIndex: 9999 }}>
          <CircularProgress />
        </Backdrop>
      )}
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('orderHistory.title')}
          links={[
            { name: t('links.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('links.orderHistory'), href: PATH_DASHBOARD.order.history }
          ]}
        />

        { !isOrderNotFound && <ReportingToolbar reporting={reporting} />}

        <Card>
        <OrderListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} onOpenFilter={handleOpenFilter} />
        <OrderTagFiltered
          formik={formik}
          isDefault={isDefault}
          filters={values}
          onResetFilter={handleResetFilter}
          isShowReset={openFilter}
        />
        <OrderListFilter
          formik={formik}
          isOpenFilter={openFilter}
          onResetFilter={handleResetFilter}
          onCloseFilter={handleCloseFilter}
          shops={Object.values(restaurants)}
          staffs={Object.values(staffs)}
        />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <OrderListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={orders.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const {id, total, from, billing,  status, orderAt, paymentStatus, mode } = row;
                    let statusColor='';
                    if(status === 'new' || status === 'ready' || status === 'accepted'){
                        statusColor = 'warning'
                    }else if(status === 'cancelled' || status === 'rejected' || status === 'lost'){
                        statusColor = 'error'
                    }else{
                      statusColor = 'success'
                    }
                    const isItemSelected = selected.indexOf(id) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, id)} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                            <Typography variant="subtitle2" noWrap>
                              {billing?.receiver}
                            </Typography>
                        </TableCell>
                        <TableCell style={{ minWidth: 160 }}>{from.name}</TableCell>
                        <TableCell style={{ minWidth: 160 }}>{mode}</TableCell>
                        <TableCell style={{ minWidth: 160 }}>{fCurrency(total)}</TableCell>
                        <TableCell style={{ minWidth: 160 }}>{paymentStatus}</TableCell>
                        <TableCell style={{ minWidth: 160 }}>
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={statusColor}
                          >
                            {status?.toUpperCase()}
                          </Label>
                        </TableCell>
                        <TableCell style={{ minWidth: 160 }}>{fDate(orderAt)}</TableCell>
                        <TableCell align="right">
                          <OrderMoreMenu  orderId={id} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isOrderNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6}>
                        <Box sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={orders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
