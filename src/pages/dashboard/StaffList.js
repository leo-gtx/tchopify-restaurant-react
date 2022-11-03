import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack5';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// material
import { useTheme} from '@material-ui/core/styles';
import {
  Box,
  Card,
  Table,
  Button,
  TableRow,
  Checkbox,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@material-ui/core';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { handleGetStaffs, handleDeleteStaff } from '../../redux/actions/staffs';
// utils
import { fDate } from '../../utils/formatTime';
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
    StaffListHead,
    StaffListToolbar,
    StaffMoreMenu
} from '../../components/_dashboard/staff/staff-list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'fullname', label: 'table.fullname', alignRight: false },
  { id: 'email', label: 'table.email', alignRight: false },
  { id: 'role', label: 'table.role', alignRight: false },
  { id: 'emailVerified', label: 'table.verified', alignRight: false },
  { id: 'createdAt', label: 'table.createAt', alignRight: false },
  { id: '' }
];

/* const ThumbImgStyle = styled('img')(({ theme }) => ({
  width: 64,
  height: 64,
  objectFit: 'cover',
  margin: theme.spacing(0, 2),
  borderRadius: theme.shape.borderRadiusSm
})); */

// ----------------------------------------------------------------------

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
    return filter(array, (_staff) => _staff.fullname.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }

  return stabilizedThis.map((el) => el[0]);
}

// ----------------------------------------------------------------------

export default function StaffList() {
  const { t} = useTranslation();
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();
  const staffs  = useSelector((state) => Object.values(state.staffs));
  const authedUser = useSelector((state)=>state.authedUser);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('createdAt');
  const { enqueueSnackbar } = useSnackbar();
  useEffect(()=>{
    dispatch(handleGetStaffs(authedUser.id))
  },[dispatch, authedUser])
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = staffs.map((n) => n.fullname);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, fullname) => {
    const selectedIndex = selected.indexOf(fullname);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, fullname);
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

  const handleDelete = (staffId, filename) => {
     dispatch(handleDeleteStaff({staffId, filename}, enqueueSnackbar(t('actions.deleteSuccess'), { variant: 'success' })));
  };

  const handleDeleteAll = () => {
    if(window.confirm(t('actions.deleteAll'))){
      staffs.forEach((c)=>{
        if(selected.includes(c.fullname)){
          dispatch(handleDeleteStaff({staffId:c.id, filename: c.filename}, enqueueSnackbar(t('actions.deleteSuccess'), { variant: 'success' })))
        }
      })
      setSelected([])
    }
    
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - staffs.length) : 0;

  const filteredStaffs = applySortFilter(staffs, getComparator(order, orderBy), filterName);

  const isStaffNotFound = filteredStaffs.length === 0;

  return (
    <Page title="Staff: Staff List | Tchopify">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('staffList.title')}
          links={[
            { name: t('links.dashboard'), href: PATH_DASHBOARD.root },
            {
              name: t('links.staff'),
              href: PATH_DASHBOARD.staff.root
            },
            { name: t('links.staffList') }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.staff.new}
              startIcon={<Icon icon={plusFill} />}
            >
              {t('actions.newStaff')}
            </Button>
          }
        />

        <Card>
          <StaffListToolbar onDeleteAll={handleDeleteAll} numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <StaffListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={staffs.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredStaffs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, fullname, email, filename, role, isVerified, createdAt } = row;

                    const isItemSelected = selected.indexOf(fullname) !== -1;

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
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, fullname)} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Box
                            sx={{
                              py: 2,
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            
                            <Typography variant="subtitle2" noWrap>
                              {fullname}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell style={{ minWidth: 160 }}>{email}</TableCell>
                        <TableCell style={{ minWidth: 160 }}>{role}</TableCell>
                        <TableCell style={{ minWidth: 160 }}>
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={
                              isVerified ? 'success' : 'error'
                            }
                          >
                            {isVerified? 'Yes': 'No'}
                          </Label>
                        </TableCell>
                        <TableCell style={{ minWidth: 160 }}>{fDate(createdAt)}</TableCell>
                        <TableCell align="right">
                          <StaffMoreMenu onDelete={() => handleDelete(id, filename)} staffId={id} />
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
                {isStaffNotFound && (
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
            count={staffs.length}
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
