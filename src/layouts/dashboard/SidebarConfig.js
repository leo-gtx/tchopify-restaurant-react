// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// utils 
import { ROLES } from '../../utils/utils';
// components
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  booking: getIcon('ic_booking'),
  home: getIcon('ic_home'),
  wallet: getIcon('ic_wallet'),
  configuration: getIcon('ic_configuration'),
  marketing: getIcon('ic_marketing'),
  order: getIcon('ic_order')
};

const sidebarConfig = (user) => {
  const config = [];
  // GENERAL
  // ----------------------------------------------------------------------
  if ([ROLES.owner.value].includes(user.role)) config.push(
    {

      subheader: 'menu.general',
      items: [
        { title: 'menu.dashboard', path: PATH_DASHBOARD.general.home, icon: ICONS.dashboard },
      ]
    }
  )

  // TOOLS
  // ----------------------------------------------------------------------
  if([ROLES.waitress.value, ROLES.admin.value, ROLES.chef.value ].includes(user.role)) config.push(
     {
    subheader: 'menu.tools',
    items: [
      {
        title: 'menu.pos',
        path: PATH_DASHBOARD.pos.root,
        icon: ICONS.ecommerce,
      }
    ]
  })

  // MANAGEMENT
  // ----------------------------------------------------------------------
  const management = {
    subheader: 'menu.management',
    items: [
      {
        title: 'menu.order',
        path: PATH_DASHBOARD.order.root,
        icon: ICONS.order,
        children: [
          { title: 'menu.deliveryOrders', path: PATH_DASHBOARD.order.deliveryOrders},
          { title: 'menu.takeawayOrders', path: PATH_DASHBOARD.order.takeawayOrders},
          { title: 'menu.posOrders', path: PATH_DASHBOARD.order.posOrders}
        ]
      }
      
    ]
  }

  if([ROLES.owner.value, ROLES.admin.value].includes(user.role)) management.items[0].children.push(
    { 
      title: 'menu.history',
      path: `${PATH_DASHBOARD.order.history}`
  })

  if([ROLES.owner.value, ROLES.admin.value].includes(user.role)) management.items.push(
    {
    title: 'menu.menu',
    path: PATH_DASHBOARD.menu.root,
    icon: ICONS.kanban,
    children: [
      { title: 'menu.dishes', path: PATH_DASHBOARD.menu.dishes},
      { title: 'menu.newDish', path: PATH_DASHBOARD.menu.create},
      { title: 'menu.categories', path: PATH_DASHBOARD.menu.subcategories},
    ]
  }
  )

  if([ROLES.owner.value].includes(user.role)) management.items.push(
    {                                                                                                        
    title: 'menu.store',
    path: PATH_DASHBOARD.store.root,
    icon: ICONS.cart,
    children: [
      { title: 'menu.stores', path: PATH_DASHBOARD.store.stores },
      { title: 'menu.newStore', path: PATH_DASHBOARD.store.create },
      
    ]
  })

  if( [ROLES.owner.value].includes(user.role)) management.items.push(
    {
    title: 'menu.staff',
    path: PATH_DASHBOARD.staff.root,
    icon: ICONS.user,
    children: [
      { title: 'menu.staffList', path: PATH_DASHBOARD.staff.list },
      { title: 'menu.newStaff', path: PATH_DASHBOARD.staff.new },
    ]
  }
  )

  config.push(management)

  return config

};

export default sidebarConfig;
