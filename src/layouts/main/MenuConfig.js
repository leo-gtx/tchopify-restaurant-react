import { Icon } from '@iconify/react';
import loginFill from '@iconify/icons-eva/log-in-fill';
// routes
import {PATH_AUTH } from '../../routes/paths';

// ----------------------------------------------------------------------

const ICON_SIZE = {
  width: 22,
  height: 22
};

const menuConfig = [
  { title: 'Login', path: PATH_AUTH.login, icon: <Icon icon={loginFill} {...ICON_SIZE} /> }
];

export default menuConfig;
