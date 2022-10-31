import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// material
import { useTheme, styled } from '@material-ui/core/styles';
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
import { handleGetDishes, handleDeleteDish } from '../../redux/actions/dishes';
// utils
import { fDate } from '../../utils/formatTime';
import { getOwnerId } from '../../utils/utils';
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
  MenuListHead,
  MenuListToolbar,
  MenuMoreMenu
} from '../../components/_dashboard/menu/menu-list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'table.dish', alignRight: false },
  { id: 'price', label: 'table.price', alignRight: false },
  { id: 'createdAt', label: 'table.createdAt', alignRight: false },
  { id: 'isPublished', label: 'table.published', alignRight: false },
  { id: ''}
];

const ThumbImgStyle = styled('img')(({ theme }) => ({
  width: 64,
  height: 64,
  objectFit: 'cover',
  margin: theme.spacing(0, 2),
  borderRadius: theme.shape.borderRadiusSm
}));

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
    return filter(array, (_dish) => _dish.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }

  return stabilizedThis.map((el) => el[0]);
}

// ----------------------------------------------------------------------

export default function DishesList() {
  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();
  const dishes  = useSelector((state) => Object.values(state.dishes));
  const authedUser = useSelector( (state)=> state.authedUser);
  const owner  = getOwnerId(authedUser);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('createdAt');

  useEffect(() => {
     dispatch(handleGetDishes(owner));
  }, [dispatch, owner]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = dishes.map((n) => n.name);
      setSelected(newSelecteds);
      return;
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

  const handleDelete = (dishId) => {
      const data = {
          dishId,
          filename: dishes.find((item)=>item.id === dishId).filename,
      };
     dispatch(handleDeleteDish(data, ()=>console.log("Dish Deleted")));
  };

  const handleDeleteAll = () => {
    if(window.confirm(t('flash.deleteAll'))){
      const promises= [];
    dishes.forEach((d)=>{
      if(selected.includes(d.name)){
        promises.push(dispatch(handleDeleteDish({dishId: d.id, filename: d.filename}, ()=>console.log(`Dish ${d.name} deleted`))))
      }
    })
    Promise.all(promises);
    setSelected([])
    }
      
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dishes.length) : 0;

  const filteredDishes = applySortFilter(dishes, getComparator(order, orderBy), filterName);

  const isDishNotFound = filteredDishes.length === 0;

  return (
    <Page title="Menu: Dish List | Tchopify">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('dishList.title')}
          links={[
            { name: t('links.dashboard'), href: PATH_DASHBOARD.root },
            {
              name: t('links.menu'),
              href: PATH_DASHBOARD.menu.root,
            },
            { name: t('links.dishList') }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.menu.create}
              startIcon={<Icon icon={plusFill} />}
            >
              {t('actions.newDish')}
            </Button>
          }
        />

        <Card>
          <MenuListToolbar onDeleteAll={handleDeleteAll} numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <MenuListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dishes.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredDishes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, image, createdAt, isPublished, price } = row;

                    const isItemSelected = selected.indexOf(name) !== -1;

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
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Box
                            sx={{
                              py: 2,
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <ThumbImgStyle alt={name} src={image} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell style={{ minWidth: 160 }}>{`${price} XAF`}</TableCell>
                        <TableCell style={{ minWidth: 160 }}>{fDate(createdAt)}</TableCell>
                        <TableCell style={{ minWidth: 160 }}>
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={
                              (isPublished === true && 'success') ||
                              (isPublished === false && 'error')
                            }
                          >
                            {sentenceCase(isPublished? 'yes': 'no')}
                          </Label>
                        </TableCell>
                        <TableCell align="right">
                          <MenuMoreMenu onDelete={() => handleDelete(id)} dishName={name} dishId={id} />
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
                {isDishNotFound && (
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
            count={dishes.length}
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
