import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import Sidebar from '../../components/Sidebar';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const [profileName, setProfileName] = useState("");
    const [profileRole, setProfileRole] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);

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

    useEffect(() => {
        const accesstoken = localStorage.getItem("user");
        if (accesstoken) {
            const parseUser = JSON.parse(accesstoken);
            setProfileName(parseUser.username);
            setProfileRole(parseUser.role);
        }
        else {
            toast.error("Something Error!!");
        }
    }, []);
    return (
        <>
            <div className="min-h-screen bg-gray-100">
                <Navigation toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <Sidebar isOpen={sidebarOpen} name={profileName} role={profileRole} handleLogout={handleLogout} />
                <main className="pt-20 md:ml-64 p-4 transition-all">
                    {children}
                </main>
            </div>
            <Toaster />
        </>
    )
}

export default Layout