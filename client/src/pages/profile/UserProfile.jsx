import { useEffect, useState } from "react";
import Layout from "../layout/Layout"
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const base_url = "http://localhost:7001";

const UserProfile = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profileRole, setProfileRole] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profileActive, setProfileActive] = useState("");
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");
    const { id } = useParams();
    const navigate=useNavigate();

    const handleSingleUser = async () => {
        try {
            const response = await axios.get(`${base_url}/api/users/single/${id}`, {
                headers: { "Authorization": `Bearer ${token}` },
                validateStatus: () => true
            });
            if (response.status === 200) {
                setUsername(response.data.username);
                setEmail(response.data.email);
                const usersactive = response.data.isLoggedIn;
                if (usersactive === true) {
                    setProfileActive("Active");
                }
                else {
                    setProfileActive("Inactive");
                }
            }
        }
        catch (err) {
            toast.error("Server Error!!");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Password do not match!");
            return;
        }
        setError("");
        try {
            const response = await axios.put(`${base_url}/api/users/update/${id}`, { username, email, password }, {
                headers: { "Authorization": `Bearer ${token}` },
                validateStatus: () => true
            });
            if (response.status === 200) {
                toast.success(response.data.message);
                navigate("/users");
            }
            else if (response.status === 402) {
                toast.error(response.data.message);
            }
            else {
                toast.error("Something Error!!");
            }
        }
        catch (err) {
            toast.error("Server Error!!");
        }
    }
    useEffect(() => {
        handleSingleUser();
          const accesstoken = localStorage.getItem("user");
          if (accesstoken) {
              const parseUser = JSON.parse(accesstoken);
              setProfileRole(parseUser.role);
              const usersactive = parseUser.isLoggedIn;
              if (usersactive === true) {
                  setProfileActive("Active");
              }
              else {
                  setProfileActive("Inactive");
              }
          }
          else {
              toast.error("Something Error!!");
          }
    }, []);

    return (
        <Layout>
            <div className="pt-24 px-6 nunito-uniquifier">
                <h2 className="text-2xl font-bold mb-6">Admin Profile</h2>

                <div className="row gap-4">

                    {/* LEFT PROFILE CARD */}
                    <div className="col-lg-4 bg-white shadow-lg rounded-xl p-6 flex flex-col items-center">

                        {/* Avatar */}
                        <img
                            src="https://i.pravatar.cc/150?img=12"
                            alt="Profile"
                            className="w-32 h-32 rounded-full border-4 border-blue-500"
                        />

                        <h3 className="text-xl font-semibold mt-4">{username}</h3>
                        <p className="text-gray-600 text-sm">{profileRole}</p>

                        {/* Stats */}
                        <div className="w-full mt-6">
                            <div className="flex justify-between p-3 bg-gray-50 rounded-lg mb-2">
                                <span className="font-semibold">Role:</span>
                                <span>{profileRole}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="font-semibold">Status:</span>
                                <span className="text-green-600">{profileActive}</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PROFILE FORM */}
                    <div className="col-lg-7 bg-white shadow-lg rounded-xl p-6">
                        <h4 className="text-lg font-semibold mb-4">Profile Details</h4>

                        <form className="space-y-4">

                            <div>
                                <label className="font-medium">UserName</label>
                                <input
                                    type="text"
                                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={username} onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="font-medium">Email</label>
                                <input
                                    type="email"
                                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="row">
                                <div className="col-lg-6">
                                    <label className="font-medium">New Password</label>
                                    <input
                                        type="text"
                                        className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <div className="col-lg-6">
                                    <label className="font-medium">Comfirm Password</label>
                                    <input
                                        type="text"
                                        className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    {error && <p className="text-red-600 mt-2">{error}</p>}
                                </div>
                            </div>

                            <button
                                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                                onClick={handleSubmit}  >
                                Update Profile
                            </button>

                        </form>
                    </div>
                </div>
            </div>
            <Toaster />
        </Layout>
    )
}

export default UserProfile