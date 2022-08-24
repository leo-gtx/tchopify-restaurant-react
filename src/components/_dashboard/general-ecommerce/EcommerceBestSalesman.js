// material
import { useTheme } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  Table,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  CardHeader,
  Typography,
  Rating,
  TableContainer
} from '@material-ui/core';
//
import Label from '../../Label';
import Scrollbar from '../../Scrollbar';


// ----------------------------------------------------------------------

export default function EcommerceBestSalesman() {
  const {t} = useTranslation();
  const theme = useTheme();
  const { dishes, dashboard } = useSelector((state)=>state);
  const { mostOrdered } = dashboard;
  return (
    <Card sx={{ pb: 3 }}>
      <CardHeader title={t('dashboard.mostOrderedTitle')} sx={{ mb: 3 }} />
      <Scrollbar>
        <TableContainer >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{ t('dashboard.product') }</TableCell>
                <TableCell align="right">{ t('dashboard.rank') }</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mostOrdered && mostOrdered.length > 0 && mostOrdered.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar alt={dishes[row.id].name} variant='rounded' src={dishes[row.id].image} />
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle2"> {dishes[row.id].name}</Typography>
                        <Rating size='small' value={dishes[row.id].rating} readOnly/>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      color={
                        (index === 0 && 'primary') ||
                        (index === 1 && 'info') ||
                        (index === 2 && 'success') ||
                        (index === 3 && 'warning') ||
                        'error'
                      }
                    >
                      {`Top ${index + 1}`}
                    </Label>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    </Card>
  );
}
