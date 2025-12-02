import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigate, redirect, Route, Routes } from 'react-router-dom'
import Signup from './pages/auth/Signup'
import "./App.css"
import Login from './pages/auth/Login';
import AdminHome from './pages/admin/AdminHome';
import ManagerHome from './pages/manager/ManagerHome';
import UserHome from './pages/user/UserHome';
import Accessdenied from './pages/AccessDenied/Accessdenied';
import UserProfile from './pages/profile/UserProfile';
import RoleView from './pages/admin/roles/RoleView';
import PermissionList from './pages/admin/permission/PermissionList';
import UserList from './pages/admin/users/UserList';

const App = () => {

  const PrivateRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    if (!token) {
      return <Navigate to="/login" replace />
    }
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/access-denied" replace />
    }
    return children
  };

  const redirectUser = () => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (!token) return <Navigate to="/login" replace />;

    switch (userRole) {
      case "admin":
        return <Navigate to="/users/admin" replace />;
      case "manager":
        return <Navigate to="/users/manager" replace />;
      case "user":
        return <Navigate to="/users/user" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  };

  return (
    <div className='App'>
      <Routes>
        {/* Auth Routes */}
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/signup' element={localStorage.getItem("token") ? redirectUser() : <Signup />} />
        <Route path="/login" element={localStorage.getItem("token") ? redirectUser() : <Login />
        } />

        {/* Auto Redirect */}
        <Route path='/users' element={redirectUser()} />


        {/* User Routes */}
        <Route path='/users/admin' element={<PrivateRoute allowedRoles={["admin"]} ><AdminHome /></PrivateRoute>} />
        <Route path='/users/manager' element={<PrivateRoute allowedRoles={["admin", "manager"]}><ManagerHome /></PrivateRoute>} />
        <Route path='/users/user' element={<PrivateRoute allowedRoles={["admin", "manager", "user"]}><UserHome /></PrivateRoute>} />

        {/* Roles */}
        <Route path='/users/admin/roles' element={<PrivateRoute allowedRoles={["admin"]} ><RoleView /></PrivateRoute>} />

         {/* Permissions */}
        <Route path='/users/admin/permissions' element={<PrivateRoute allowedRoles={["admin"]} ><PermissionList /></PrivateRoute>} />

        {/* User Profile */}
        <Route path='/users/admin/user' element={<PrivateRoute allowedRoles={["admin"]} ><UserList /></PrivateRoute>} />

        {/* User Profile */}
        <Route path='/users/profile/:id' element={<PrivateRoute allowedRoles={["admin", "manager", "user"]}><UserProfile /></PrivateRoute>} />


        {/* Access-denied Routes */}
        <Route path='/access-denied' element={<Accessdenied />} />
      </Routes>
    </div>
  )
}

export default App