import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuards';
import RoleBasedGuard from '../guards/RoleBasedGuard';
// components
import LoadingScreen from '../components/LoadingScreen';
// utils
import { ROLES } from '../utils/utils';


// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    // Auth Routes
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          )
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          )
        },
        { path: 'reset-password', element: <ResetPassword /> },
      ]
    },
    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { path: '/', element: <Navigate to="/dashboard/home" replace /> },
        { path: 'home', element: (
        <RoleBasedGuard accessibleRoles={[ROLES.owner.value]}>
          <Dashboard/>
        </RoleBasedGuard>
        )},
        {
          path: 'user',
          children: [
            { path: '/', element: <Navigate to="/dashboard/user/account" replace /> },
            { path: 'account', element: (
              <RoleBasedGuard accessibleRoles={[ROLES.owner.value]}>
                <UserAccount />
              </RoleBasedGuard>) },
          ]
        },
        {
          path: 'menu',
          children: [
            { path: '/', element: <Navigate to='/dashboard/menu/dishes' replace/>},
            { path: '/dishes', element: (
            <RoleBasedGuard accessibleRoles={[ROLES.owner.value, ROLES.admin.value]}>
              <DishList/>
            </RoleBasedGuard>)},
            { path: '/dish/new', element: (
              <RoleBasedGuard accessibleRoles={[ROLES.owner.value, ROLES.admin.value]}>
                <DishCreate/>
              </RoleBasedGuard>)},
            { path: '/dish/:name/edit', element: (
              <RoleBasedGuard accessibleRoles={[ROLES.owner.value, ROLES.admin.value]}>
                <DishCreate/>
              </RoleBasedGuard>) },
            { path: '/subcategories', element: (
              <RoleBasedGuard accessibleRoles={[ROLES.owner.value, ROLES.admin.value]}>
                <SubcategoryList/>
              </RoleBasedGuard>)},
            { path: '/subcategory/new', element: (
              <RoleBasedGuard accessibleRoles={[ROLES.owner.value, ROLES.admin.value]}>
                <SubcategoryNew/>
              </RoleBasedGuard>)},
            { path: '/subcategory/:name/edit', element: (
              <RoleBasedGuard accessibleRoles={[ROLES.owner.value, ROLES.admin.value]}>
                <SubcategoryNew/>
              </RoleBasedGuard>)},
              {
                path: '/dish/:dishName/:dishId/reviews', element:(
                  <RoleBasedGuard accessibleRoles={[ROLES.owner.value, ROLES.admin.value]}>
                    <ReviewList/>
                  </RoleBasedGuard>
                )
              }
          ]
        },
        {
          path: 'store',
          children: [
            { path: '/', element: <Navigate to='/dashboard/store/list' replace/>},
            { path: '/list', element: (
              <RoleBasedGuard accessibleRoles={[ROLES.owner.value]}>
                <RestaurantList/>
              </RoleBasedGuard>)},
            { path: '/new', element: (
              <RoleBasedGuard accessibleRoles={[ROLES.owner.value]}>
                <RestaurantCreate/>
              </RoleBasedGuard>)},
            { path: '/:restaurantId/edit', element: (
              <RoleBasedGuard accessibleRoles={[ROLES.owner.value]}>
                <RestaurantCreate/>
              </RoleBasedGuard>)},
            { path: '/:restaurantId/business-hours', element: (
              <RoleBasedGuard accessibleRoles={[ROLES.owner.value]}>
                <BusinessHour/>
              </RoleBasedGuard>)},
          ]
        },
        {
          path: 'staff',
          children: [
            { path: '/', element: <Navigate to='/dashboard/staff/list' replace/>},
            { path: '/list', element: (
              <RoleBasedGuard accessibleRoles={[ROLES.owner.value]}>
                <StaffList/>
              </RoleBasedGuard>)},
            { path: '/:name/edit', element: (
              <RoleBasedGuard accessibleRoles={[ROLES.owner.value]}>
                <StaffCreate/>
              </RoleBasedGuard>)},
            { path: '/new', element: (
              <RoleBasedGuard accessibleRoles={[ROLES.owner.value]}>
                <StaffCreate/>
              </RoleBasedGuard>)}
          ]
        },
        {
          path: 'order',
          children: [
            { path: '/', element: <Navigate to='/dashboard/order/delivery-orders' replace/>},
            { path: '/delivery-orders', element: (
              <RoleBasedGuard accessibleRoles={[ROLES.owner.value, ROLES.admin.value, ROLES.chef.value, ROLES.waitress.value]}>
                <DeliveryOrders/>
              </RoleBasedGuard>)
            },
            { path: '/takeaway-orders', element: (
                <RoleBasedGuard accessibleRoles={[ROLES.owner.value, ROLES.admin.value, ROLES.chef.value, ROLES.waitress.value]}>
                  <TakeawayOrders/>
                </RoleBasedGuard>)
            },
            { path: '/pos-orders', element: (
              <RoleBasedGuard accessibleRoles={[ROLES.owner.value, ROLES.admin.value, ROLES.waitress.value, ROLES.chef.value]}>
                <DineOrders/>
              </RoleBasedGuard>)},
            { path: '/history', element: (
              <RoleBasedGuard accessibleRoles={[ROLES.owner.value, ROLES.admin.value]}>
                <OrdersHistory/>
              </RoleBasedGuard>)},
            { path: '/:id/details', element: (
              <RoleBasedGuard accessibleRoles={[ROLES.owner.value, ROLES.admin.value, ROLES.waitress.value]}>
                <OrderInvoice/>
              </RoleBasedGuard>)}
          ]
        },
        {
          path: 'pos',
          element: (
            <RoleBasedGuard accessibleRoles={[ROLES.waitress.value, ROLES.admin.value, ROLES.chef.value]}>
                <Pos/>
            </RoleBasedGuard>
          )
        }
      ]
    },
    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ]
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [{ path: '/', element: <LandingPage /> }]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

// IMPORT COMPONENTS

// ---- Authentication -------
const Login = Loadable(lazy(() => import('../pages/authentication/Login')));
const Register = Loadable(lazy(() => import('../pages/authentication/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/authentication/ResetPassword')));

// -----Dashboard-----
const Dashboard = Loadable(lazy(() => import('../pages/dashboard/Dashboard')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));


// Order

const DeliveryOrders = Loadable(lazy(()=>import('../pages/dashboard/DeliveryOrders')));
const OrdersHistory  = Loadable(lazy(()=>import('../pages/dashboard/OrderHistory')));
const OrderInvoice  = Loadable(lazy(()=>import('../pages/dashboard/Invoice')));
const DineOrders = Loadable(lazy(()=>import('../pages/dashboard/DineOrders')));
const TakeawayOrders = Loadable(lazy(()=>import('../pages/dashboard/TakeawayOrders')));
// Restaurant
const RestaurantCreate = Loadable(lazy(()=>import('../pages/dashboard/RestaurantCreate')));
const RestaurantList = Loadable(lazy(()=>import('../pages/dashboard/RestaurantList')));

// User
const UserAccount = Loadable(lazy(() => import('../pages/dashboard/UserAccount')));
const BusinessHour = Loadable(lazy(()=>import('../pages/dashboard/BusinessHour')));
// Menu
const SubcategoryList = Loadable(lazy(() => import('../pages/dashboard/SubcategoryList')));
const SubcategoryNew = Loadable(lazy(() => import('../pages/dashboard/SubcategoryCreate')));
const DishCreate = Loadable(lazy(()=>import('../pages/dashboard/DishCreate')));
const DishList = Loadable(lazy(()=>import('../pages/dashboard/DishesList')));
const ReviewList = Loadable(lazy(()=>import('../pages/dashboard/ReviewList')));

// Staff
const StaffCreate = Loadable(lazy(()=>import('../pages/dashboard/StaffCreate')));
const StaffList = Loadable(lazy(()=>import('../pages/dashboard/StaffList')));

// Pos
const Pos = Loadable(lazy(()=>import('../pages/dashboard/Pos')));

// ------Main------
const LandingPage = Loadable(lazy(() => import('../pages/LandingPage')));

