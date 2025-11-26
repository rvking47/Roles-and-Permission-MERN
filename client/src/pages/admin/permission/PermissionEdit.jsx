import axios from 'axios';
import { X } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const PermissionEdit = ({ editedName, editingPermission, setEditedName, onClose, setEditingPermission, base_url, token, handlePermissions }) => {

    const handleSaveEdit = async () => {
        try {
            const result = await axios.put(`${base_url}/api/permission/update/${editingPermission}`, { name: editedName.trim() }, {
                headers: { "Authorization": `Bearer ${token}` },
                validateStatus: () => true
            });
            if (result.status === 200) {
                // update local state using the id string
                //  setRoles(prev => prev.map(r => (r._id === id ? { ...r, name: editedName.trim() } : r)));
                toast.success(result.data?.message || 'Permission updated');
                setEditingPermission(null);
                setEditedName('');
                handlePermissions();
                onClose();
            } else {
                toast.error(result.data?.message || 'Update failed');
            }
        }
        catch (err) {
            toast.error("Server Error", err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <h3 className="text-xl font-semibold text-slate-800">Edit Permission</h3>
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
                        <label htmlFor="permissionName" className="block text-sm font-medium text-slate-700 mb-2">
                            Permission Name
                        </label>
                        <input
                            id="permissionName"
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter permission name"
                            autoFocus
                        />
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
                        onClick={handleSaveEdit}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PermissionEdit