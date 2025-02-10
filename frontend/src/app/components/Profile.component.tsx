"use client";
import React, { useState } from "react";
import withAuth from "../utils/withAuth";
import UserProfileForm from "./UserProfileForm.component";

interface User {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: string;
    password: string;
    address: string;
    phone: number;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  interface ProfileComponentProps {
    user: User;
  }

const ProfileComponent : React.FC<ProfileComponentProps>  = ({ user }) => {
    const[edit, setEdit] = useState(false)

    return (
        <>
            <div className="max-w-2xl mx-auto bg-white shadow-md absolute  rounded-lg p-6">
                <h1 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-6">
                    {edit ? "Update User Profile" : "User Profile"}
                </h1>
                {user ?

                    <div className={`${edit ? "hidden" : ""}`}>
                        {/* User Information */}
                        <div className="grid grid-cols-1 gap-4">
                            {/* Full Name */}
                            <div className="flex items-center">
                                <span className="font-semibold text-gray-700 w-32">Full Name:</span>
                                <span className="text-gray-600">{user.fullName || "N/A"}</span>
                            </div>

                            {/* Username */}
                            <div className="flex items-center">
                                <span className="font-semibold text-gray-700 w-32">Username:</span>
                                <span className="text-gray-600">{user.username || "N/A"}</span>
                            </div>

                            {/* Email */}
                            <div className="flex items-center">
                                <span className="font-semibold text-gray-700 w-32">Email:</span>
                                <span className="text-gray-600">{user.email || "N/A"}</span>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center">
                                <span className="font-semibold text-gray-700 w-32">Phone:</span>
                                <span className="text-gray-600">{user.phone || "N/A"}</span>
                            </div>

                            {/* Address */}
                            <div className="flex items-center">
                                <span className="font-semibold text-gray-700 w-32">Address:</span>
                                <span className="text-gray-600">{user.address || "N/A"}</span>
                            </div>

                            {/* Account Verification */}
                            <div className="flex items-center">
                                <span className="font-semibold text-gray-700 w-32">Account Status:</span>
                                <span
                                    className={`px-3 py-1 text-sm rounded-lg ${user.isVerified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {user.isVerified ? "Verified" : "Not Verified"}
                                </span>
                            </div>

                            {/* Created At */}
                            <div className="flex items-center">
                                <span className="font-semibold text-gray-700 w-32">Joined:</span>
                                <span className="text-gray-600">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            {/* Updated At */}
                            <div className="flex items-center">
                                <span className="font-semibold text-gray-700 w-32">Last Updated:</span>
                                <span className="text-gray-600">
                                    {new Date(user.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        {/* Edit Button */}
                        <button onClick={() => { setEdit(true) }} className="absolute bottom-4 right-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow-md transition duration-200">
                            Edit
                        </button>

                    </div>
                    :
                    <div>
                        loading...
                    </div>
                }

                <div className={`${edit ? "block" : "hidden"}`}>

                    <UserProfileForm setEdit={setEdit} />

                </div>
            </div>
        </>

    );
};

export default withAuth(ProfileComponent);
