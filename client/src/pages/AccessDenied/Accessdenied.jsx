import React from 'react'

const Accessdenied = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-semibold text-red-600">Access Denied</h1>
                <p className="mt-2 text-gray-600">You are not authorized to view this page.</p>
            </div>
        </div>
    )
}

export default Accessdenied