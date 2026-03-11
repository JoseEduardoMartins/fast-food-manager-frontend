import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@components/guards';
import Dashboard from './Dashboard';
import UserList from './Users/UserList';
import CreateUser from './Users/CreateUser';
import UserDetails from './Users/UserDetails';
import EditUser from './Users/EditUser';
import { CompanyList, CreateCompany, CompanyDetails, EditCompany } from './Companies';
import { BranchList } from './Branches/BranchList';
import { CreateBranch } from './Branches/CreateBranch';
import { BranchDetails } from './Branches/BranchDetails';
import { EditBranch } from './Branches/EditBranch';
import OrderList from './Orders/OrderList';
import CreateOrder from './Orders/CreateOrder';
import OrderDetails from './Orders/OrderDetails';
import EditOrder from './Orders/EditOrder';
import MenuList from './Menus/MenuList';
import CreateMenu from './Menus/CreateMenu';
import MenuDetails from './Menus/MenuDetails';
import EditMenu from './Menus/EditMenu';
import ProductList from './Products/ProductList';
import CreateProduct from './Products/CreateProduct';
import ProductDetails from './Products/ProductDetails';
import EditProduct from './Products/EditProduct';
import IngredientList from './Ingredients/IngredientList';
import CreateIngredient from './Ingredients/CreateIngredient';
import IngredientDetails from './Ingredients/IngredientDetails';
import EditIngredient from './Ingredients/EditIngredient';
import Stock from './Stock';
import { ROUTES } from '@common/constants';

/**
 * Protected routes - require authentication
 * Some routes also check user roles for authorization
 */
export const AppRoutes = (
  <>
    <Route
      path={ROUTES.DASHBOARD}
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.USERS}
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <UserList />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.USERS_CREATE}
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <CreateUser />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.USERS_DETAILS}
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <UserDetails />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.USERS_EDIT}
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <EditUser />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.COMPANIES}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner']}>
          <CompanyList />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.COMPANIES_CREATE}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner']}>
          <CreateCompany />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.COMPANIES_DETAILS}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner']}>
          <CompanyDetails />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.COMPANIES_EDIT}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner']}>
          <EditCompany />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.BRANCHES}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner']}>
          <BranchList />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.BRANCHES_CREATE}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner']}>
          <CreateBranch />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.BRANCHES_DETAILS}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner']}>
          <BranchDetails />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.BRANCHES_EDIT}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner']}>
          <EditBranch />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.ORDERS}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner', 'manager', 'attendant', 'delivery']}>
          <OrderList />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.ORDERS_CREATE}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner', 'manager', 'attendant', 'delivery']}>
          <CreateOrder />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.ORDERS_DETAILS}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner', 'manager', 'attendant', 'delivery']}>
          <OrderDetails />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.ORDERS_EDIT}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner', 'manager', 'attendant', 'delivery']}>
          <EditOrder />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.MENUS}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner', 'manager', 'attendant']}>
          <MenuList />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.MENUS_CREATE}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner', 'manager', 'attendant']}>
          <CreateMenu />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.MENUS_DETAILS}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner', 'manager', 'attendant']}>
          <MenuDetails />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.MENUS_EDIT}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner', 'manager', 'attendant']}>
          <EditMenu />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.PRODUCTS}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner', 'manager', 'cook', 'attendant']}>
          <ProductList />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.PRODUCTS_CREATE}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner', 'manager', 'cook', 'attendant']}>
          <CreateProduct />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.PRODUCTS_DETAILS}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner', 'manager', 'cook', 'attendant']}>
          <ProductDetails />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.PRODUCTS_EDIT}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner', 'manager', 'cook', 'attendant']}>
          <EditProduct />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.INGREDIENTS}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner', 'manager', 'cook']}>
          <IngredientList />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.INGREDIENTS_CREATE}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner', 'manager', 'cook']}>
          <CreateIngredient />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.INGREDIENTS_DETAILS}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner', 'manager', 'cook']}>
          <IngredientDetails />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.INGREDIENTS_EDIT}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner', 'manager', 'cook']}>
          <EditIngredient />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.STOCK}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner', 'manager', 'cook']}>
          <Stock />
        </ProtectedRoute>
      }
    />
  </>
);
