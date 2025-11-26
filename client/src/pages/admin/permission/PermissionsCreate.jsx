import { X } from 'lucide-react'
import React from 'react'

const PermissionsCreate = ({ handleCreatePermission, onClose, name, setName }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <form>
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-200">
                        <h3 className="text-xl font-semibold text-slate-800">Create Permisssion</h3>
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
                            <label htmlFor="newPermissionName" className="block text-sm font-medium text-slate-700 mb-2">
                                Permission Name
                            </label>
                            <input
                                id="newPermissionName"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter permission name"
                                autoFocus
                            />
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
                            onClick={handleCreatePermission}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Create Permission
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PermissionsCreate