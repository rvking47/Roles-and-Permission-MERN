import { X } from 'lucide-react';
import React, { useState } from 'react'

const PermissionView = ({ name, onClose, date }) => {
    return (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <h3 className="text-xl font-semibold text-slate-800">View Permissions</h3>
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
                    {/* Permission Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Permission Name
                        </label>
                        <div className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-800">
                            {name}
                        </div>
                    </div>
                    {/* Created Date */}
                    {date && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                            <div className="text-xs text-slate-600">
                                <span className="font-medium">Created:</span>
                                <span className="ml-2">
                                    {new Date(date).toLocaleDateString('en-US', {
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
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PermissionView