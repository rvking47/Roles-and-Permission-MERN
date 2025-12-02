import axios from 'axios';
import { X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const base_url = "http://localhost:7001";

const UserCreate = ({ handleCreateUser, onClose, formData, setFormData }) => {
    const { username, email, password, role } = formData;
    const token = localStorage.getItem("token");
    const [roles, setRoles] = useState([]);


    const handleViewRoles = async () => {
        try {
            const result = await axios.get(`${base_url}/api/role/view`, {
                headers: { "Authorization": `Bearer ${token}` },
                validateStatus: () => true
            });
            if (result.status === 200) {
                setRoles(result.data.role);
            }
        }
        catch (err) {
            toast.error("Server Error");
        }
    }

    useEffect(() => {
        handleViewRoles();
    }, []);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <form>
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-200">
                        <h3 className="text-xl font-semibold text-slate-800">Create User</h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6">
                        <div className="mb-4">
                            <label htmlFor="newUsername" className="block text-sm font-medium text-slate-700 mb-2">
                                Username
                            </label>
                            <input
                                id="newUsername"
                                type="text"
                                value={username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter Username"
                                autoFocus
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="newEmail" className="block text-sm font-medium text-slate-700 mb-2">
                                Email
                            </label>
                            <input
                                id="newEmail"
                                type="text"
                                value={email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter Email"
                                autoFocus
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                value={password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter Password"
                                autoFocus
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="newRole" className="block text-sm font-medium text-slate-700 mb-2">
                                Roles
                            </label>
                            <select onChange={(e) => setFormData({ ...formData, role: e.target.value })} value={role} className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'>
                                <option value="" disabled >Select Role-</option>
                                <option value="admin">admin</option>
                                <option value="manager">manager</option>
                                <option value="user">user</option>
                            </select>

                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleCreateUser}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Create User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserCreate