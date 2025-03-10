"use client"
import React, { Dispatch, useState } from "react";
import withAuth from "../utils/withAuth";
import axios from "axios";
import { UserInterface } from "../utils/user.interface";


const UserProfileForm = ({ user, setEdit }: { user: UserInterface, setEdit: Dispatch<React.SetStateAction<boolean>> }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(false)

  const [updated, setUpdated] = useState(false)

  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    username: user.username || "",
    phone: user.phone || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true)
    console.log("Updated Data:", formData);
    const updateUser = async () => {
      try {
        await axios.patch(`${API_URL}/updateUser`, formData, { withCredentials: true })
        setLoading(false)
        setUpdated(true)

        setEdit(false)

      } catch (error) {
        console.log("updateUserError", error)
      }
    }
    await updateUser()
  };

  return (
    <form onSubmit={handleSubmit} className={`${updated ? "hidden" : ""}space-y-4 flex flex-col justify-center items-center`}>
      {/* Full Name */}
      <div>
        <label className="text-black block mb-1" htmlFor="fullName">
          Full Name
        </label>
        <input
          className="text-black border rounded-md w-full px-2 py-1"
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
        />
      </div>
      <div>

        <label className="text-black block mb-1" htmlFor="fullName">
          username
        </label>
        <input
          className="text-black border rounded-md w-full px-2 py-1"
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
        />
      </div>



      {/* Phone */}
      <div>
        <label className="text-black block mb-1" htmlFor="phone">
          Phone
        </label>
        <input
          className="text-black border rounded-md w-full px-2 py-1"
          type="number"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
        />
      </div>

      {/* Save Button */}
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md px-4 mt-2 w-full py-2"
      >
        {loading ? "Loading..." : "Save"}
      </button>
    </form>
  );
};

export default withAuth(UserProfileForm);
