import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Edit2, Trash2, X, AlertTriangle, Plus } from 'lucide-react';
import Layout from '../../layout/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiEye } from 'react-icons/fi';

const base_url = "http://localhost:7001";

const RoleView = () => {
    const [roles, setRoles] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [deletingRole, setDeletingRole] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const itemsPerPage = 5;
    const token = localStorage.getItem("token");
    // const [rolesUser, setRolesUser] = useState([]);
    // Filter roles based on search
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewingRole, setViewingRole] = useState(null);

    // Example permissions array - replace with your actual permissions
    const [permissions, setPermissionName] = useState([]);

    const handleCreateRole = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            return toast.error("Role name is required");
        }
        try {
            const result = await axios.post(`${base_url}/api/role/create`, { name: name.trim(), permissions: selectedPermissions }, {
                headers: { "Authorization": `Bearer ${token}` },
                validateStatus: () => true
            });
            if (result.status === 200) {
                toast.success(result.data.message || "Role created successfully");
                setName("");
                setIsCreateModalOpen(false);
                setSelectedPermissions([]);
                handleFetch();
            }
            else {
                toast.error(result.data?.message || "Failed to create role");
            }
        }
        catch (err) {
            toast.error("Server Error", err);
        }
    };

    const handlePermissions = async () => {
        try {
            const result = await axios.get(`${base_url}/api/permission/view`, {
                headers: { "Authorization": `Bearer ${token}` },
                validateStatus: () => true
            });
            if (result.status === 200) {
                setPermissionName(result.data);
                setSelectedPermissions([]);
            }
        }
        catch (err) {
            toast.error("Server Error", err);
        }
    }

    const filteredRoles = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();

        return roles.filter(role =>
            role?.name?.toLowerCase().includes(term)
        );
    }, [roles, searchTerm]);


    // Pagination logic
    const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRoles = filteredRoles.slice(startIndex, endIndex);

    // Reset to page 1 when search changes

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleEdit = async (id) => {
        try {
            const result = await axios.get(`${base_url}/api/role/single/${id}`, {
                headers: { "Authorization": `Bearer ${token}` },
                validateStatus: () => true
            });
            if (result.status === 200) {
                setEditingRole(result.data.role._id);
                setEditedName(result.data.role.name || '');
                setSelectedPermissions(result.data.role.permissions);
                setIsEditModalOpen(true);
            }
        }
        catch (err) {
            toast.error("Server Error", err);
        }
    };

    const handleSaveEdit = async (id) => {
        try {
            // 🔥 Remove invalid permission IDs
            const validPermissionIds = selectedPermissions.filter(pid =>
                permissions.some(p => p._id === pid)
            );

            const result = await axios.put(
                `${base_url}/api/role/update/${id}`,
                {
                    name: editedName.trim(),
                    permissions: validPermissionIds
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    validateStatus: () => true
                }
            );

            if (result.status === 200) {
                setRoles(prev =>
                    prev.map(r => (r._id === id ? { ...r, name: editedName.trim(), permissions: validPermissionIds } : r))
                );

                toast.success(result.data?.message || "Role updated");
                setIsEditModalOpen(false);
                setEditingRole(null);
                setEditedName("");
            } else {
                toast.error(result.data?.message || "Update failed");
            }
        } catch (err) {
            toast.error("Server Error");
        }
    };


    const handleCancelEdit = () => {
        setIsEditModalOpen(false);
        setEditingRole(null);
        setEditedName('');
    };

    const handleDelete = async (id) => {
        try {
            const result = await axios.get(`${base_url}/api/role/single/${id}`, {
                headers: { "Authorization": `Bearer ${token}` },
                validateStatus: () => true
            });
            if (result.status === 200) {
                setDeletingRole(result.data.role);
                setDeleteConfirmation('');
                setIsDeleteModalOpen(true);
            }
        }
        catch (err) {
            toast.error("Server Error", err);
        }
    };

    const handleView = async (id) => {
        try {
            const result = await axios.get(`${base_url}/api/role/single/${id}`, {
                headers: { "Authorization": `Bearer ${token}` },
                validateStatus: () => true
            });
            if (result.status === 200) {
                setViewingRole(result.data.role);
                setIsViewModalOpen(true);
            }
        }
        catch (err) {
            toast.error("Server Error", err);
        }
    };


    const handleConfirmDelete = async (id) => {
        if (!deletingRole) return;
        if (deleteConfirmation !== deletingRole.name) {
            return toast.error("Please type the role name to confirm.");
        }
        try {
            const result = await axios.delete(`${base_url}/api/role/distroy/${id}`, {
                headers: { "Authorization": `Bearer ${token}` },
                validateStatus: () => true
            });
            if (result.status === 200) {
                // Remove ONLY after confirmation matches AND API success
                setRoles(prev => prev.filter(r => r._id !== id));

                toast.success(result.data.message || "Role deleted successfully");
                setIsDeleteModalOpen(false);
                setDeletingRole(null);
                setDeleteConfirmation('');
                handleFetch();
            }
        }
        catch (err) {
            toast.error("Server Error", err);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setDeletingRole(null);
        setDeleteConfirmation('');
    };

    //Api working----------------!!

    const handleFetch = async () => {
        try {
            const result = await axios.get(`${base_url}/api/role/view`, {
                headers: { "Authorization": `Bearer ${token}` },
                validateStatus: () => true
            });
            if (result.status === 200) {
                setRoles(Array.isArray(result.data.role) ? result.data.role : []);
            }
        }
        catch (err) {
            toast.error("Server Error", err);
        }
    }

    useEffect(() => {
        setCurrentPage(1);
        handleFetch();
        handlePermissions();
    }, [searchTerm]);

    return (
        <Layout>
            <div className="min-h-screen nunito-uniquifier">
                {isViewModalOpen && viewingRole && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-200">
                                <h3 className="text-xl font-semibold text-slate-800">View Role</h3>
                                <button
                                    type="button"
                                    onClick={() => setIsViewModalOpen(false)}
                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6">
                                {/* Role Name */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Role Name
                                    </label>
                                    <div className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-800">
                                        {viewingRole.name}
                                    </div>
                                </div>

                                {/* Permissions Section */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-3">
                                        Permissions ({viewingRole.permissions?.length || 0})
                                    </label>

                                    <div className="space-y-2 max-h-60 overflow-y-auto border border-slate-200 rounded-lg p-4">
                                        {viewingRole.permissions && viewingRole.permissions.length > 0 ? (
                                            viewingRole.permissions.map((permissionId) => {
                                                const permission = permissions.find(p => p._id === permissionId);

                                                // 🔥 Skip rendering if permission doesn't exist
                                                if (!permission) return null;

                                                return (
                                                    <div
                                                        key={permissionId}
                                                        className="flex items-center space-x-3 p-2 rounded bg-green-50 border border-green-200"
                                                    >
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        <span className="text-sm text-slate-700">
                                                            {permission.name}
                                                        </span>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p className="text-sm text-slate-500 text-center py-4">
                                                No permissions assigned
                                            </p>
                                        )}
                                    </div>
                                </div>


                                {/* Created Date */}
                                {viewingRole.createdAt && (
                                    <div className="mt-4 pt-4 border-t border-slate-200">
                                        <div className="text-xs text-slate-600">
                                            <span className="font-medium">Created:</span>
                                            <span className="ml-2">
                                                {new Date(viewingRole.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                                <button
                                    type="button"
                                    onClick={() => setIsViewModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Create Modal */}
                {isCreateModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                            <form>
                                {/* Modal Header */}
                                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                                    <h3 className="text-xl font-semibold text-slate-800">Create Role</h3>
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Modal Body */}
                                <div className="p-6">
                                    <div className="mb-4">
                                        <label htmlFor="newRoleName" className="block text-sm font-medium text-slate-700 mb-2">
                                            Role Name
                                        </label>
                                        <input
                                            id="newRoleName"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="Enter role name"
                                            autoFocus
                                        />
                                    </div>

                                    {/* Permissions Section */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-3">
                                            Permissions
                                        </label>
                                        <div className="space-y-2 max-h-60 overflow-y-auto border border-slate-200 rounded-lg p-4">
                                            {permissions.map((permission) => (
                                                <label
                                                    key={permission._id}
                                                    className="flex items-center space-x-3 cursor-pointer hover:bg-slate-50 p-2 rounded transition-colors"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPermissions.includes(permission._id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedPermissions(prev => [...prev, permission._id]);
                                                            } else {
                                                                setSelectedPermissions(prev =>
                                                                    prev.filter(id => id !== permission._id)
                                                                );
                                                            }
                                                        }}
                                                        className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500 focus:ring-2 mx-1"
                                                    />
                                                    <span className="text-sm text-slate-700">{permission.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCreateRole}
                                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        Create Role
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-200">
                                <h3 className="text-xl font-semibold text-slate-800">Edit Role</h3>
                                <button
                                    onClick={handleCancelEdit}
                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6">
                                <div className="mb-4">
                                    <label htmlFor="roleName" className="block text-sm font-medium text-slate-700 mb-2">
                                        Role Name
                                    </label>
                                    <input
                                        id="roleName"
                                        type="text"
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter role name"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-3">
                                        Permissions
                                    </label>
                                    <div className="space-y-2 max-h-60 overflow-y-auto border border-slate-200 rounded-lg p-4">
                                        {permissions.map((permission) => (
                                            <label
                                                key={permission._id}
                                                className="flex items-center space-x-3 cursor-pointer hover:bg-slate-50 p-2 rounded transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPermissions.includes(permission._id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedPermissions(prev => [...prev, permission._id]);
                                                        } else {
                                                            setSelectedPermissions(prev =>
                                                                prev.filter(id => id !== permission._id)
                                                            );
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500 focus:ring-2 mx-1"
                                                />
                                                <span className="text-sm text-slate-700">{permission.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                                <button
                                    onClick={handleCancelEdit}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleSaveEdit(editingRole)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && deletingRole && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                        <AlertTriangle className="w-5 h-5 text-red-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-800">Delete Role</h3>
                                </div>
                                <button
                                    onClick={handleCancelDelete}
                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6">
                                <div className="mb-4">
                                    <p className="text-slate-700 mb-4">
                                        This action <strong>cannot</strong> be undone. This will permanently delete the <strong>{deletingRole.name}</strong> role.
                                    </p>
                                    <p className="text-slate-700 mb-4">
                                        Please type <strong className="font-semibold text-slate-900">{deletingRole.name}</strong> to confirm.
                                    </p>
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        value={deleteConfirmation}
                                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="Type role name to confirm"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                                <button
                                    onClick={handleCancelDelete}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleConfirmDelete(deletingRole._id)}
                                    disabled={deleteConfirmation !== deletingRole.name}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Delete this role
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="pt-20 px-2 ">
                    <h2 className="text-2xl font-bold mb-6">Manage Roles</h2>
                    <div className="row gap-4">
                        <div className="min-h-screen bg-white rounded-lg pt-5 shadow-md sm:p-6 lg:p-8">
                            <div className="max-w-7xl mx-auto">
                                {/* Header */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h1 className="text-3xl font-bold text-slate-800 mb-2 mx-3">Roles Management</h1>
                                            <p className="text-slate-600 mx-3">Manage and view all system roles</p>
                                        </div>
                                        <button
                                            onClick={() => setIsCreateModalOpen(true)}
                                            className="p-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors mx-3"
                                            title="Create Role"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                {/* Search Bar */}
                                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search roles by name, description, or status..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Table Card */}
                                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                    {/* Desktop Table */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-slate-50 border-b border-slate-200">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">ID</th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Role Name</th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Created</th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200">
                                                {currentRoles.map((role, index) => (
                                                    <tr key={role._id} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{index + 1}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-slate-900">{role.name}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{new Date(role.createdAt).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => handleEdit(role._id)}
                                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(role._id)}
                                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleView(role._id)}
                                                                    className="p-2 text-purple-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                    title="View"
                                                                >
                                                                    <FiEye className="w-4 h-4" />
                                                                </button>

                                                            </div>

                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Cards */}
                                    <div className="md:hidden divide-y divide-slate-200">
                                        {currentRoles.map((role, index) => (
                                            <div key={role._id} className="p-4 hover:bg-slate-50 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="font-semibold text-slate-900">{role.name}</h3>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(role._id)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(role._id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleView(role._id)}
                                                            className="p-2 text-purple-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="View"
                                                        >
                                                            <FiEye className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                                                    <div>
                                                        <span className="text-slate-500">ID:</span>
                                                        <span className="ml-1 text-slate-900">{index + 1}</span>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <span className="text-slate-500">Created:</span>
                                                        <span className="ml-1 text-slate-900">{role.createdAt}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* No Results */}
                                    {currentRoles.length === 0 && (
                                        <div className="text-center py-12">
                                            <p className="text-slate-500">No roles found matching your search.</p>
                                        </div>
                                    )}

                                    {/* Pagination */}
                                    {filteredRoles.length > 0 && (
                                        <div className="px-4 py-4 border-t border-slate-200 bg-slate-50">
                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                                <div className="text-sm text-slate-600">
                                                    Showing {startIndex + 1} to {Math.min(endIndex, filteredRoles.length)} of {filteredRoles.length} results
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        disabled={currentPage === 1}
                                                        className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <ChevronLeft className="w-5 h-5 text-slate-600" />
                                                    </button>

                                                    <div className="flex gap-1">
                                                        {[...Array(totalPages)].map((_, index) => {
                                                            const page = index + 1;
                                                            if (
                                                                page === 1 ||
                                                                page === totalPages ||
                                                                (page >= currentPage - 1 && page <= currentPage + 1)
                                                            ) {
                                                                return (
                                                                    <button
                                                                        key={page}
                                                                        onClick={() => handlePageChange(page)}
                                                                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                                                            ? 'bg-blue-600 text-white'
                                                                            : 'border border-slate-300 text-slate-700 hover:bg-slate-100'
                                                                            }`}
                                                                    >
                                                                        {page}
                                                                    </button>
                                                                );
                                                            } else if (page === currentPage - 2 || page === currentPage + 2) {
                                                                return <span key={page} className="px-2 text-slate-400">...</span>;
                                                            }
                                                            return null;
                                                        })}
                                                    </div>

                                                    <button
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        disabled={currentPage === totalPages}
                                                        className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <ChevronRight className="w-5 h-5 text-slate-600" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default RoleView;