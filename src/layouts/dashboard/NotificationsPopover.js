import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Icon } from '@iconify/react';
import { orderBy } from 'lodash';
import moment from 'moment';
import bellFill from '@iconify/icons-eva/bell-fill';
import clockFill from '@iconify/icons-eva/clock-fill';
// material
import { alpha } from '@material-ui/core/styles';
import {
  Box,
  List,
  Badge,
  Avatar,
  Divider,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton
} from '@material-ui/core';
// components
import Scrollbar from '../../components/Scrollbar';
import MenuPopover from '../../components/MenuPopover';
import { MIconButton } from '../../components/@material-extend';
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useIsMountedRef from '../../hooks/useIsMountedRef';
// actions
import { GetOrdersByStatus, GetOrdersByStatusAndShop } from '../../redux/actions/order';
// utils 
import { getOwnerId, isOwner } from '../../utils/utils';

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {notification.description}
      </Typography>
    </Typography>
  );
  return {
    avatar: <img alt={notification.title} src={notification.avatar} />,
    title
  };
}

NotificationItem.propTypes = {
  notification: PropTypes.object.isRequired
};

function NotificationItem({ notification }) {
  const { link } = notification;
  const { avatar, title } = renderContent(notification);
  return (
    <ListItemButton
      to={link}
      disableGutters
      component={RouterLink}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected'
        })
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled'
            }}
          >
            <Box component={Icon} icon={clockFill} sx={{ mr: 0.5, width: 16, height: 16 }} />
            {formatDistanceToNow(new Date(notification.createdAt))}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

export default function NotificationsPopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [newOrders, setNewOrders] = useState([]);
  const { authedUser } = useSelector((state)=>state);
  const {t} = useTranslation();
  const isMountedRef = useIsMountedRef();
  const notifications = orderBy(newOrders.map((item) => ({
    id: item.id,
    title: t('notification.itemTitle',{value: item.id}),
    description: t('notification.itemSubtitle', {user: item?.billing?.receiver || `Table ${item?.billing?.table}`, mode: t(`notification.${item.mode.toLowerCase()}`)}),
    avatar: item?.billing?.image || '/static/icons/ic_notification_package.svg',
    createdAt: item.orderAt,
    link: `${PATH_DASHBOARD.order.root}/${item.id}/details`,
    isUnRead: true
  })), 'createdAt', 'desc');
  const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

  useEffect(()=>{
    if(isMountedRef.current){
      if(isOwner(authedUser)){
        GetOrdersByStatus(
          {ownerId: getOwnerId(authedUser), status: 'new'},
           (data)=>{
            setNewOrders(Object.values(data).filter((item)=>moment(item.orderAt).isSame(new Date(), 'month')))
          })
      }else{
          GetOrdersByStatusAndShop(
            { status: 'new', shopId: authedUser.shop},
            (data)=>{
              setNewOrders(Object.values(data).filter((item)=>moment(item.orderAt).isSame(new Date(), 'month')))
            })
      }
    }
    
    return ()=>isMountedRef.current = false;
  },[setNewOrders, authedUser, isMountedRef])

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <MIconButton
        ref={anchorRef}
        size="large"
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
        sx={{
          ...(open && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity)
          })
        }}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Icon icon={bellFill} width={20} height={20} />
        </Badge>
      </MIconButton>

      <MenuPopover open={open} onClose={handleClose} anchorEl={anchorRef.current} sx={{ width: 360 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">{t('notification.title')}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('notification.subtitle', {value: totalUnRead})}
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Scrollbar sx={{ overflowY: 'auto', height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                {t('notification.today')}
              </ListSubheader>
            }
          >
            {notifications.filter((item)=>moment(item.createdAt).isSame(new Date(), 'day')).map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                {t('notification.after')}
              </ListSubheader>
            }
          >
            {notifications.filter((item)=>!moment(item.createdAt).isSame(new Date(), 'day')).map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </List>
        </Scrollbar>

        <Divider />

      </MenuPopover>
    </>
  );
}
