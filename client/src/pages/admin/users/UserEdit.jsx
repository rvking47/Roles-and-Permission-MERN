import axios from 'axios';
import { X } from 'lucide-react'
import React from 'react'
import toast from 'react-hot-toast';

const UserEdit = ({ editingUser, onClose, base_url, token, handleView, editFormDta, setEditFormData, roles }) => {

    const { username, email, role, password } = editFormDta;

    const hanldeUpdate = async () => {
        try {
            const result = await axios.put(`${base_url}/api/users/update/${editingUser}`, { username: username, email: email, role: role, password: password }, {
                headers: { "Authorization": `Bearer ${token}` },
                validateStatus: () => true
            });
            if (result.status === 200) {
                toast.success(result.data.message);
                handleView();
                onClose();
            }
        }
        catch (err) {
            toast.error("Server Error", err);
        }
    }
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <h3 className="text-xl font-semibold text-slate-800">Edit User</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <div className="mb-4">
                        <label htmlFor="userName" className="block text-sm font-medium text-slate-700 mb-2">
                            UserName
                        </label>
                        <input
                            id="userName"
                            type="text"
                            value={username}
                            onChange={(e) => setEditFormData({ ...editFormDta, username: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter username"
                            autoFocus
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="userEmail" className="block text-sm font-medium text-slate-700 mb-2">
                            Email
                        </label>
                        <input
                            id="userEmail"
                            type="text"
                            value={email}
                            onChange={(e) => setEditFormData({ ...editFormDta, email: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter email"
                            autoFocus
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="userNewPassword" className="block text-sm font-medium text-slate-700 mb-2">
                            New Password
                        </label>
                        <input
                            id="userPassword"
                            type="text"
                            value=""
                            onChange={(e) => setEditFormData({ ...editFormDta, email: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter password"
                            autoFocus
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="userRole" className="block text-sm font-medium text-slate-700 mb-2">
                            Role
                        </label>
                        <select
                            value={role}   // this contains roleId
                            onChange={(e) =>
                                setEditFormData({ ...editFormDta, role: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                        >
                            <option value="">Select Role</option>

                            {roles?.map((r) => (
                                <option key={r._id} value={r._id}>
                                    {r.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={hanldeUpdate}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UserEdit