import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Signup from './pages/auth/Signup';
import "./App.css"
import Login from './pages/auth/Login';
import AdminHome from './pages/admin/AdminHome';
import ManagerHome from './pages/manager/ManagerHome';
import UserHome from './pages/user/UserHome';
import AccessDenied from './pages/AccessDenied/AccessDenied';
import UserProfile from './pages/profile/UserProfile';
import RoleView from './pages/admin/roles/RoleView';
import PermissionList from './pages/admin/permission/PermissionList';
import UserList from './pages/admin/users/UserList';


const App = () => {

  // ------------- Private Route -------------
  const PrivateRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (!token) return <Navigate to="/login" replace />;

    if (!allowedRoles.includes(userRole))
      return <Navigate to="/access-denied" replace />;

    return children;
  };

  // ------------- Redirect Based on Role -------------
  const redirectUser = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) return <Navigate to="/login" replace />;

    const routes = {
      admin: "/users/admin",
      manager: "/users/manager",
      user: "/users/user",
    };

    return <Navigate to={routes[role] || "/login"} replace />;
  };

  return (
    <div className="App">
      <Routes>

        {/* AUTH ROUTES */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={!localStorage.getItem("token") ? <Signup /> : redirectUser()} />
        <Route path="/login" element={!localStorage.getItem("token") ? <Login /> : redirectUser()} />

        {/* AUTO REDIRECT */}
        <Route path="/users" element={redirectUser()} />

        {/* USERS ROUTES */}
        <Route path="/users/admin" element={ <PrivateRoute allowedRoles={["admin"]}> <AdminHome /></PrivateRoute>}/>

        <Route path="/users/manager" element={<PrivateRoute allowedRoles={["admin", "manager"]}><ManagerHome /></PrivateRoute>}/>

        <Route path="/users/user" element={<PrivateRoute allowedRoles={["admin", "manager", "user"]}><UserHome /></PrivateRoute>}/>

        {/* ADMIN: ROLES */}
        <Route path="/users/admin/roles"  element={<PrivateRoute allowedRoles={["admin"]}> <RoleView /></PrivateRoute>}/>

        {/* ADMIN: PERMISSIONS */}
        <Route path="/users/admin/permissions" element={<PrivateRoute allowedRoles={["admin"]}><PermissionList /></PrivateRoute>}/>

        {/* ADMIN: USER LIST (permission protected) */}
        <Route path="/users/admin/user" element={<UserList />}/>

        {/* USER PROFILE */}
        <Route path="/users/profile/:id" element={<PrivateRoute allowedRoles={["admin", "manager", "user"]}><UserProfile /></PrivateRoute>}/>

        {/* ACCESS DENIED */}
        <Route path="/access-denied" element={<AccessDenied />} />

      </Routes>
    </div>
  );
};

export default App;
