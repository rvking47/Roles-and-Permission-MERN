import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Edit2, Trash2, X, AlertTriangle, Plus } from 'lucide-react';
import Layout from '../../layout/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiEye } from 'react-icons/fi';
import PermissionView from './PermissionView';
import PermissonDelete from './PermissonDelete';
import PermissionsCreate from './PermissionsCreate';
import PermissionEdit from './PermissionEdit';

const base_url = "http://localhost:7001";

const PermissionList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const token = localStorage.getItem("token");
    const [permissions, setPermissionName] = useState([]);
    const [singlePermission, setSinglePermission] = useState("");
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingPermission, setDeletingPermission] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [name, setName] = useState("");
    const [editingPermission, setEditingPermission] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);




    const handlePermissions = async () => {
        try {
            const result = await axios.get(`${base_url}/api/permission/view`, {
                headers: { "Authorization": `Bearer ${token}` },
                validateStatus: () => true
            });
            if (result.status === 200) {
                setPermissionName(result.data);
            }
        }
        catch (err) {
            toast.error("Server Error", err);
        }
    }

    const filteredPermissions = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();

        return permissions.filter(permission =>
            permission?.name?.toLowerCase().includes(term)
        );
    }, [permissions, searchTerm]);


    // Pagination logic
    const totalPages = Math.ceil(filteredPermissions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPermissions = filteredPermissions.slice(startIndex, endIndex);

    // Reset to page 1 when search changes

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    //View Api working----------------!!

    const handleView = async (id) => {
        try {
            const result = await axios.get(`${base_url}/api/permission/single/${id}`, {
                headers: { "Authorization": `Bearer ${token}` },
                validateStatus: () => true
            });
            if (result.status === 200) {
                setSinglePermission(result.data.permission);
                setIsViewModalOpen(true);
            }
        }
        catch (err) {
            toast.error("Server Error", err);
        }
    }

    //Delete Api working----------------!!

    const handleDelete = async (id) => {
        try {
            const result = await axios.get(`${base_url}/api/permission/single/${id}`, {
                headers: { "Authorization": `Bearer ${token}` },
                validateStatus: () => true
            });
            if (result.status === 200) {
                setDeletingPermission(result.data.permission);
                setDeleteConfirmation('');
                setIsDeleteModalOpen(true);
            }
        }
        catch (err) {
            toast.error("Server Error", err);
        }
    }

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setDeletingPermission(null);
        setDeleteConfirmation('');
    };

    const handleConfirmDelete = async (id) => {
        if (!deletingPermission) return;
        if (deleteConfirmation !== deletingPermission.name) {
            return toast.error("Please type the permission name to confirm.");
        }
        try {
            const result = await axios.delete(`${base_url}/api/permission/distroy/${id}`, {
                headers: { "Authorization": `Bearer ${token}` },
                validateStatus: () => true
            });
            if (result.status === 200) {
                // Remove ONLY after confirmation matches AND API success
                setPermissionName(prev => prev.filter(r => r._id !== id));

                toast.success(result.data.message || "Permission deleted successfully");
                setIsDeleteModalOpen(false);
                setDeletingPermission(null);
                setDeleteConfirmation('');
                handlePermissions();
            }
        }
        catch (err) {
            toast.error("Server Error", err);
        }
    };

    //Create Api working----------------!!

    const handleCreatePermission = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            return toast.error("Permission name is required");
        }
        try {
            const result = await axios.post(`${base_url}/api/permission/create`, { name: name.trim() }, {
                headers: { "Authorization": `Bearer ${token}` },
                validateStatus: () => true
            });
            if (result.status === 201) {
                toast.success(result.data.message || "Permission created successfully");
                setName("");
                setIsCreateModalOpen(false);
                handlePermissions();
            }
            else {
                toast.error(result.data?.message || "Failed to create permission");
            }
        }
        catch (err) {
            toast.error("Server Error", err);
        }
    };

    //Edit Api working----------------!!
    const handleEdit = async (id) => {
        try {
            const result = await axios.get(`${base_url}/api/permission/single/${id}`, {
                headers: { "Authorization": `Bearer ${token}` },
                validateStatus: () => true
            });
            if (result.status === 200) {
                setEditingPermission(result.data.permission._id);
                setEditedName(result.data.permission.name || '');
                setIsEditModalOpen(true);
            }
        }
        catch (err) {
            toast.error("Server Error", err);
        }
    };

    const handleCancelEdit = () => {
        setIsEditModalOpen(false);
        setEditingPermission(null);
        setEditedName('');
    };

    useEffect(() => {
        setCurrentPage(1);
        handlePermissions();
    }, [searchTerm]);

    return (
        <Layout>
            <div className="min-h-screen nunito-uniquifier">
                <div className="pt-20 px-2">
                    <h2 className="text-2xl font-bold mb-6">Manage Permissions</h2>
                    <div className="row gap-4">
                        <div className="min-h-screen bg-white rounded-lg pt-5 shadow-md sm:p-6 lg:p-8">
                            <div className="max-w-7xl mx-auto">
                                {/* Header */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h1 className="text-3xl font-bold text-slate-800 mb-2 mx-3">Permissions Management</h1>
                                            <p className="text-slate-600 mx-3">Manage and view all system permissions</p>
                                        </div>
                                        <button
                                            onClick={() => setIsCreateModalOpen(true)}
                                            className="p-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors mx-3"
                                            title="Create Permission"
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
                                            placeholder="Search permissions by name, description, or status..."
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
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Permission Name</th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Created</th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200">
                                                {currentPermissions.map((permission, index) => (
                                                    <tr key={permission._id} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{index + 1}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-slate-900">{permission.name}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{new Date(permission.createdAt).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => handleEdit(permission._id)}
                                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(permission._id)}
                                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleView(permission._id)}
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
                                        {currentPermissions.map((permission, index) => (
                                            <div key={permission._id} className="p-4 hover:bg-slate-50 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="font-semibold text-slate-900">{permission.name}</h3>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(permission._id)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(permission._id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleView(permission._id)}
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
                                                        <span className="ml-1 text-slate-900">{permission.createdAt}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* No Results */}
                                    {currentPermissions.length === 0 && (
                                        <div className="text-center py-12">
                                            <p className="text-slate-500">No permissions found matching your search.</p>
                                        </div>
                                    )}

                                    {/* Pagination */}
                                    {filteredPermissions.length > 0 && (
                                        <div className="px-4 py-4 border-t border-slate-200 bg-slate-50">
                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                                <div className="text-sm text-slate-600">
                                                    Showing {startIndex + 1} to {Math.min(endIndex, filteredPermissions.length)} of {filteredPermissions.length} results
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
            {isViewModalOpen && (
                <PermissionView name={singlePermission.name} date={singlePermission.createdAt}
                    onClose={() => setIsViewModalOpen(false)}
                />
            )}

            {isDeleteModalOpen && (
                <PermissonDelete name={deletingPermission.name} ids={deletingPermission._id} handleCancelDelete={handleCancelDelete} onclose={() => handleCancelDelete(false)} handleConfirmDelete={handleConfirmDelete} deleteConfirmation={deleteConfirmation} setDeleteConfirmation={setDeleteConfirmation} />
            )}

            {isCreateModalOpen && (
                <PermissionsCreate handleCreatePermission={handleCreatePermission} onClose={() => setIsCreateModalOpen(false)} name={name} setName={setName} />
            )}

            {isEditModalOpen && (
                <PermissionEdit onClose={handleCancelEdit} editedName={editedName} editingPermission={editingPermission} setEditedName={setEditedName} setEditingPermission={setEditingPermission} base_url={base_url} token={token} handlePermissions={handlePermissions} />
            )}
        </Layout>
    );
};

export default PermissionList;