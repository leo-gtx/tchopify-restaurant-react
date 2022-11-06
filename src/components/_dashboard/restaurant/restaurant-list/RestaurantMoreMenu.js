import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import React, { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import clockFill from '@iconify/icons-eva/clock-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Tooltip, Grid, Button } from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

RestaurantMoreMenu.propTypes = {
  onDelete: PropTypes.func,
  restaurantId: PropTypes.string,
};

export default function RestaurantMoreMenu({ onDelete, restaurantId }) {
  const { t } = useTranslation();
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isTooltipOpen, setTooltipOpen] = useState(false);
  const handleCloseTooltip = ()=>setTooltipOpen(false);
  const handleOpenTooltip = ()=>setTooltipOpen(true);
  const handleCloseMenu = ()=>setIsOpen(false);
  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Tooltip
         PopperProps={{
          disablePortal: true
         }}
         open={isTooltipOpen}
         onClose={handleCloseTooltip}
         leaveDelay={5000}
         title={
          <>
            <Grid container spacing={2} direction='row'>
              <Grid item sm={12} md={6}>
              <Button variant='text' onClick={onDelete}>{t('actions.sure')}</Button>
              </Grid>
              <Grid item sm={12} md={6}>
                <Button variant='text' color='inherit' onClick={handleCloseTooltip}>{t('actions.no')}</Button>
              </Grid>
            </Grid>
          </>
         }
        >
          <MenuItem onClick={handleOpenTooltip} sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              <Icon icon={trash2Outline} width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary={t('actions.delete')} primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        </Tooltip>

        <MenuItem
          component={RouterLink}
          to={`${PATH_DASHBOARD.store.root}/${restaurantId}/edit`}
          sx={{ color: 'text.secondary' }}
        >
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary={t('actions.edit')} primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem
          component={RouterLink}
          to={`${PATH_DASHBOARD.store.root}/${restaurantId}/business-hours`}
          sx={{ color: 'text.secondary' }}
        >
          <ListItemIcon>
            <Icon icon={clockFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary={t('actions.businessHours')} primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
