import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigate, Route, Routes } from 'react-router-dom'
import Signup from './pages/auth/Signup'
import "./App.css"
import Login from './pages/auth/Login';
import AdminHome from './pages/admin/AdminHome';
import ManagerHome from './pages/manager/ManagerHome';
import UserHome from './pages/user/UserHome';
import Accessdenied from './pages/AccessDenied/Accessdenied';

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
  }
  return (
    <div className='App'>
      <Routes>
        {/* Auth Routes */}
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />

        {/* User Routes */}
        <Route path='/users/admin' element={<PrivateRoute allowedRoles={["admin"]} ><AdminHome /></PrivateRoute>} />
        <Route path='/users/manager' element={<PrivateRoute allowedRoles={["admin", "manager"]}><ManagerHome /></PrivateRoute>} />
        <Route path='/users/user' element={<PrivateRoute allowedRoles={["admin", "manager", "user"]}><UserHome /></PrivateRoute>} />

        {/* Access-denied Routes */}
        <Route path='/access-denied' element={<Accessdenied />} />
      </Routes>
    </div>
  )
}

export default App