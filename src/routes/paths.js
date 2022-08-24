// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}
const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------
export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),

};

// ----------------------------------------------------------------------
export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    home: path(ROOTS_DASHBOARD, '/home'),
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
  },
  store: {
    root: path(ROOTS_DASHBOARD, '/store'),
    dashboard: path(ROOTS_DASHBOARD, '/store/dashboard'),
    stores: path(ROOTS_DASHBOARD, '/store/list'),
    create: path(ROOTS_DASHBOARD, '/store/new'),
    businessHours: path(ROOTS_DASHBOARD, '/store/business-hours'),
  },
  menu: {
    root: path(ROOTS_DASHBOARD, '/menu'),
    dishes: path(ROOTS_DASHBOARD, '/menu/dishes'),
    create: path(ROOTS_DASHBOARD, '/menu/dish/new'),
    subcategories: path(ROOTS_DASHBOARD, '/menu/subcategories'),
    createSubcategory: path(ROOTS_DASHBOARD, '/menu/subcategory/new')
  },
  staff: {
    root: path(ROOTS_DASHBOARD, '/staff'),
    list: path(ROOTS_DASHBOARD, '/staff/list'),
    new: path(ROOTS_DASHBOARD, '/staff/new')
  },
  order: {
    root: path(ROOTS_DASHBOARD, '/order'),
    deliveryOrders: path(ROOTS_DASHBOARD, '/order/delivery-orders'),
    takeawayOrders: path(ROOTS_DASHBOARD, '/order/takeaway-orders'),
    posOrders: path(ROOTS_DASHBOARD, '/order/pos-orders'),
    history: path(ROOTS_DASHBOARD, '/order/history')
  },
  pos: {
    root: path(ROOTS_DASHBOARD, '/pos'),
  },
  
};
