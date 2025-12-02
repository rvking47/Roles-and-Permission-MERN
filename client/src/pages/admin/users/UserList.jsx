import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaEye, FaPlus, FaSearch } from 'react-icons/fa';
import Layout from '../../layout/Layout';
import { ChevronLeft, ChevronRight, Edit2, Plus, Trash2 } from 'lucide-react';
import { FiEye } from 'react-icons/fi';
import axios from 'axios';
import UserCreate from './UserCreate';
import toast from 'react-hot-toast';
import UserView from './UserView';
import UserDelete from './UserDelete';
import UserEdit from './UserEdit';

const base_url = "http://localhost:7001";

const UserList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;
    const token = localStorage.getItem("token");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: ""
    });
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [singleUser, setSingleUser] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingUser, setDeletingUser] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    const [allUsers, setAllUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [editFormDta, setEditFormData] = useState({
        username: "",
        email: "",
        role: ""
    });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [roles, setRoles] = useState([]);

    // Filter users based on search
    const filteredUsers = allUsers.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user._id.toString().includes(searchTerm)
    );

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleView = async () => {
        try {
            const result = await axios.get(`${base_url}/api/users/view`, {
                headers: { "Authorization": `Bearer ${token}` },
                validateStatus: () => true
            });
            if (result.status === 200) {
                setAllUsers(result.data);
            }
        }
        catch (err) {
            toast.error("Server Error");
        }
    }

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post(`${base_url}/api/auth/register`, formData, {
                headers: { "Content-Type": "application/json" },
                validateStatus: () => true
            });
            if (result.status === 201) {
                toast.success(result.data.message);
                setFormData({
                    username: "",
                    email: "",
                    password: "",
                    role: ""
                });
                setIsCreateModalOpen(false);
                handleView();
            }
        }
        catch (err) {
            toast.error("Server Error");
        }
    }

    const handleUserView = async (id) => {
        try {
            const result = await axios.get(`${base_url}/api/users/single/${id}`, {
                headers: { "Authorization": `Bearer ${token}` },
                validateStatus: () => true
            });
            console.log(result);
            if (result.status === 200) {
                setSingleUser(result.data);
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
            const result = await axios.get(`${base_url}/api/users/single/${id}`, {
                headers: { "Authorization": `Bearer ${token}` },
                validateStatus: () => true
            });
            console.log(result);
            if (result.status === 200) {
                setDeletingUser(result.data);
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
        setDeletingUser(null);
        setDeleteConfirmation('');
    };

    const handleConfirmDelete = async (id) => {
        if (!deletingUser) return;
        if (deleteConfirmation !== deletingUser.username) {
            return toast.error("Please type the permission name to confirm.");
        }
        try {
            const result = await axios.delete(`${base_url}/api/users/distroy/${id}`, {
                headers: { "Authorization": `Bearer ${token}` },
                validateStatus: () => true
            });
            if (result.status === 200) {
                // Remove ONLY after confirmation matches AND API success

                toast.success(result.data.message || "User deleted successfully");
                setIsDeleteModalOpen(false);
                setDeletingUser(null);
                setDeleteConfirmation('');
                handleView();
            }
        }
        catch (err) {
            toast.error("Server Error", err);
        }
    };

    const handleEdit = async (id) => {
        try {
            const result = await axios.get(`${base_url}/api/users/single/${id}`, {
                headers: { "Authorization": `Bearer ${token}` },
                validateStatus: () => true
            });
            console.log(result.data.role);
            if (result.status === 200) {
                setEditingUser(result.data._id);
                setEditFormData({
                    username: result.data.username,
                    email: result.data.email,
                    role: result.data.role
                });
                setIsEditModalOpen(true);
            }
        }
        catch (err) {
            toast.error("Server Error", err);
        }
    };

    const handleCancelEdit = () => {
        setIsEditModalOpen(false);
        setEditingUser(null);
        setEditFormData('');
    };

    const handleFetchRole = async () => {
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
        handleView();
        handleFetchRole();
    }, []);

    return (
        <Layout>
            <div className="min-h-screen nunito-uniquifier">
                <div className="pt-20 px-2">
                    <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
                    <div className="row gap-4">
                        <div className="min-h-screen bg-white rounded-lg pt-5 shadow-md sm:p-6 lg:p-8">
                            <div className="max-w-7xl mx-auto">
                                {/* Header */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h1 className="text-3xl font-bold text-slate-800 mb-2 mx-3">Users Management</h1>
                                            <p className="text-slate-600 mx-3">Manage and view all system users</p>
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
                                <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
                                    <div className="relative">
                                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search by ID, username, or email..."
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Username</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {currentUsers.length > 0 ? (
                                                    currentUsers.map((user, index) => {
                                                        const isDisabled = user.role?.name === "admin";
                                                        return (

                                                            <tr key={user._id} className="hover:bg-gray-50 transition duration-150">
                                                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{user.username}</td>
                                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{user.role?.name}</td>
                                                                <td className="px-4 py-4 whitespace-nowrap">
                                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isLoggedIn === true ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                                        }`}>
                                                                        {user.isLoggedIn === true ? 'Active' : 'Inactive'}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(user.createdAt).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}</td>
                                                                <td className="px-4 py-4 whitespace-nowrap text-center">
                                                                    <div className="flex items-center justify-center gap-2">

                                                                        {/* EDIT */}
                                                                        <button onClick={() => handleEdit(user._id)}
                                                                            className={`p-2 rounded-lg transition-colors ${isDisabled
                                                                                ? "text-gray-400 cursor-not-allowed"
                                                                                : "text-blue-600 hover:bg-blue-50"
                                                                                }`}
                                                                            title="Edit"
                                                                            disabled={isDisabled}
                                                                        >
                                                                            <Edit2 className="w-4 h-4" />
                                                                        </button>

                                                                        {/* DELETE */}
                                                                        <button onClick={() => handleDelete(user._id)}
                                                                            className={`p-2 rounded-lg transition-colors ${isDisabled
                                                                                ? "text-gray-400 cursor-not-allowed"
                                                                                : "text-red-600 hover:bg-red-50"
                                                                                }`}
                                                                            title="Delete"
                                                                            disabled={isDisabled}
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </button>

                                                                        {/* VIEW */}
                                                                        <button onClick={() => handleUserView(user._id)}
                                                                            className={`p-2 rounded-lg transition-colors ${isDisabled
                                                                                ? "text-gray-400 cursor-not-allowed"
                                                                                : "text-purple-600 hover:bg-purple-50"
                                                                                }`}
                                                                            title="View"
                                                                            disabled={isDisabled}
                                                                        >
                                                                            <FiEye className="w-4 h-4" />
                                                                        </button>

                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                ) : (
                                                    <tr>
                                                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                                            No users found matching your search.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {filteredUsers.length > 0 && (
                                        <div className="bg-gray-50 px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 gap-3">
                                            <div className="text-sm text-gray-700">
                                                Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
                                                <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of{' '}
                                                <span className="font-medium">{filteredUsers.length}</span> results
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => paginate(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className={`px-3 py-1  ${currentPage === 1
                                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                                        }`}
                                                >
                                                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                                                </button>
                                                {[...Array(totalPages)].map((_, index) => (
                                                    <button
                                                        key={index + 1}
                                                        onClick={() => paginate(index + 1)}
                                                        className={`px-3 py-1 ${currentPage === index + 1
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                                            }`}
                                                    >
                                                        {index + 1}
                                                    </button>
                                                ))}
                                                <button
                                                    onClick={() => paginate(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    className={`px-3 py-1 ${currentPage === totalPages
                                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                                        }`}
                                                >
                                                    <ChevronRight className="w-5 h-5 text-slate-600" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isCreateModalOpen && (
                <UserCreate
                    formData={formData}
                    setFormData={setFormData}
                    handleCreateUser={handleCreateUser}
                    onClose={() => setIsCreateModalOpen(false)}
                />
            )}
            {isViewModalOpen && (
                <UserView username={singleUser.username} email={singleUser.email} role={singleUser.role} date={singleUser.createdAt} isLoggedIn={singleUser.isLoggedIn}
                    onClose={() => setIsViewModalOpen(false)}
                />
            )}
            {isDeleteModalOpen && (
                <UserDelete name={deletingUser.username} ids={deletingUser._id} handleCancelDelete={handleCancelDelete} onclose={() => handleCancelDelete(false)} handleConfirmDelete={handleConfirmDelete} deleteConfirmation={deleteConfirmation} setDeleteConfirmation={setDeleteConfirmation} />
            )}
            {isEditModalOpen && (
                <UserEdit editFormDta={editFormDta} setEditFormData={setEditFormData} onClose={handleCancelEdit} editingUser={editingUser} setEditingUser={setEditingUser} base_url={base_url} token={token} handleView={handleView} roles={roles} />
            )}
        </Layout>
    );
};

export default UserList;