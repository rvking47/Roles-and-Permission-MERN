import { useEffect, useState } from "react";
import Layout from "../layout/Layout"



const UserProfile = () => {
        const [profileName, setProfileName] = useState("");
        const [profileRole, setProfileRole] = useState("");
        const [profileEmail, setProfileEmail] = useState("");

    useEffect(() => {
        const accesstoken = localStorage.getItem("user");
        if (accesstoken) {
            const parseUser = JSON.parse(accesstoken);
            setProfileName(parseUser.username);
            setProfileRole(parseUser.role);
            setProfileEmail(parseUser.email);
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

                        <h3 className="text-xl font-semibold mt-4">{profileName}</h3>
                        <p className="text-gray-600 text-sm">{profileRole}</p>

                        {/* Stats */}
                        <div className="w-full mt-6">
                            <div className="flex justify-between p-3 bg-gray-50 rounded-lg mb-2">
                                <span className="font-semibold">Role:</span>
                                <span>{profileRole}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="font-semibold">Status:</span>
                                <span className="text-green-600">Active</span>
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
                                    value={profileName}
                                />
                            </div>

                            <div>
                                <label className="font-medium">Email</label>
                                <input
                                    type="email"
                                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={profileEmail}
                                />
                            </div>

                            <div className="row">
                                <div className="col-lg-6">
                                    <label className="font-medium">New Password</label>
                                    <input
                                        type="text"
                                        className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div className="col-lg-6">
                                    <label className="font-medium">Comfirm Password</label>
                                    <input
                                        type="text"
                                        className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                            >
                                Update Profile
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default UserProfile