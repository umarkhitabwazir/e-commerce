"use client";
import React, { useState } from "react";
import withAuth from "../utils/withAuth";
import UserProfileForm from "./UserProfileForm.component";
import { UserInterface } from "../utils/user.interface";


interface ProfileComponentProps {
    user: UserInterface;
}

const ProfileComponent: React.FC<ProfileComponentProps> = ({ user }) => {
    const [edit, setEdit] = useState(false)

    return (
        <>
            <div className="max-w-2xl mx-auto  bg-transparent shadow-xl rounded-xl overflow-hidden relative w-full">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                    <h1 className="text-2xl font-bold text-white">
                        {edit ? "Update User Profile" : "User Profile"}
                    </h1>
                </div>

                <div className="p-6 ">
                    {user ? (
                        <div className={edit ? "hidden" : "space-y-6"}>
                            <div className="grid  grid-cols-1 gap-4">
                                {/* User Information Items */}
                                {[
                                   { label: "Username", value: user.username },
                                    { label: "Email", value: user.email },
                                   ].map((item, index) => (
                                    <div key={index} className="flex items-center py-3 border-b border-gray-100">
                                        <span className="font-medium text-gray-600 w-40 flex-shrink-0">
                                            {item.label}:
                                        </span>
                                        <span className="text-gray-800 truncate">
                                            {item.value || "N/A"}
                                        </span>
                                    </div>
                                ))}

                                {/* Account Status */}
                                <div className="flex items-center py-3 border-b border-gray-100">
                                    <span className="font-medium text-gray-600 w-40 flex-shrink-0">
                                        Account Status:
                                    </span>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user.isVerified
                                            ? "bg-green-100 text-green-700"
                                            : "bg-rose-100 text-rose-700"
                                        }`}>
                                        {user.isVerified ? "Verified" : "Not Verified"}
                                    </span>
                                </div>

                                {/* Dates */}
                                <div className="flex items-center py-3 border-b border-gray-100">
                                    <span className="font-medium text-gray-600 w-40 flex-shrink-0">
                                        Joined:
                                    </span>
                                    <span className="text-gray-800">
                                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>

                                <div className="flex items-center py-3 border-b border-gray-100">
                                    <span className="font-medium text-gray-600 w-40 flex-shrink-0">
                                        Last Updated:
                                    </span>
                                    <span className="text-gray-800">
                                        {new Date(user.updatedAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>

                            {/* Edit Button */}
                            <button
                                onClick={() => setEdit(true)}
                                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Edit Profile
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                        </div>
                    )}

                    {/* Edit Form */}
                    <div className={edit ? "block" : "hidden"}>
                        <UserProfileForm setEdit={setEdit} />
                    </div>
                </div>
            </div>
        </>

    );
};

export default withAuth(ProfileComponent);
