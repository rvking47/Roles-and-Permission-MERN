import React from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminHome = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.clear;
    toast.loading("Admin Logout...", { duration: 2000 });
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  }
  return (
    <>
      <button onClick={handleLogout} className='btn btn-danger'>Logout</button>
      <h1>Admin</h1>
      <Toaster />
    </>
  )
}

export default AdminHome