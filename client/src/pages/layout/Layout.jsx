import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';

const base_url = "http://localhost:7001";

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const [profileName, setProfileName] = useState("");
    const [profileRole, setProfileRole] = useState("");
    const [profileId, setProfileId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const token = localStorage.getItem("token");
    const [permissions, setPermissions] = useState([]);
 

    const handleLogout = async (profileId) => {
        try {
            const result = await axios.post(
                `${base_url}/api/auth/logout/${profileId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                    validateStatus: () => true
                }
            );

            if (result.status === 200) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("role");
                toast.loading("Admin Logged Out", { duration: 1000 });

                setTimeout(() => {
                    navigate("/login", { replace: true });
                }, 1000);
            } else {
                toast.error(result.data.message || "Logout failed");
            }
        } catch (err) {
            toast.error("Server Error");
        }
    };

    const handleSingleUser = async (profileId) => {
        try {
            const response = await axios.get(`${base_url}/api/users/single/${profileId}`, {
                headers: { "Authorization": `Bearer ${token}` },
                validateStatus: () => true
            });
            if (response.status === 200) {
                setProfileName(response.data.username);
            }
        }
        catch (err) {
            toast.error("Server Error!!");
        }
    }

    useEffect(() => {
        const accesstoken = localStorage.getItem("user");
        if (accesstoken) {
            const parseUser = JSON.parse(accesstoken);
            setProfileRole(parseUser.role);
            setProfileId(parseUser._id);
            handleSingleUser(parseUser._id);
        }
    }, []);
    return (
        <>
            <div className="min-h-screen bg-gray-100">
                <Navigation toggleSidebar={() => setSidebarOpen(!sidebarOpen)} userId={profileId} />
                <Sidebar isOpen={sidebarOpen} name={profileName} role={profileRole} handleLogout={() => handleLogout(profileId)} />
                <main className="pt-20 md:ml-64 p-4 transition-all">
                    {children}
                </main>
            </div>
            <Toaster />
        </>
    )
}

export default Layout