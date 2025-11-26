import { AlertTriangle, X } from 'lucide-react'
import React from 'react'

const PermissonDelete = ({ name, onclose, handleConfirmDelete, ids, deleteConfirmation, setDeleteConfirmation }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800">Delete Permission</h3>
                    </div>
                    <button
                        onClick={onclose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <div className="mb-4">
                        <p className="text-slate-700 mb-4">
                            This action <strong>cannot</strong> be undone. This will permanently delete the <strong>{name}</strong> permission.
                        </p>
                        <p className="text-slate-700 mb-4">
                            Please type <strong className="font-semibold text-slate-900">{name}</strong> to confirm.
                        </p>
                    </div>

                    <div>
                        <input
                            type="text"
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Type permission name to confirm"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                    <button
                        onClick={onclose}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handleConfirmDelete(ids)}
                        disabled={deleteConfirmation !== name}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Delete this permission
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PermissonDelete