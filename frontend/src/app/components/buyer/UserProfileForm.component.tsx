"use client";
import React, { useState, useEffect, Dispatch } from "react";
import axios, { AxiosError } from "axios";
import useAuth from "@/app/auths/auth";

type User = { username?: string; phone?: string; updatedAt?: string; [key: string]: any } | null;

const UserProfileForm = ({ setUser, setEdit }: { setUser: Dispatch<React.SetStateAction<User>>; setEdit: Dispatch<React.SetStateAction<boolean>> }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [updated, setUpdated] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        phone: user.phone ? user.phone.toString() : "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);

    try {
      await axios.patch(`${API_URL}/updateUser`, formData, { withCredentials: true });
      
        setUser((prev: User) => ({
    ...(prev || {}),
    username: formData.username,
    phone: formData.phone,
    updatedAt: new Date().toISOString(),
  }));
        setUpdated((prev) => !prev);
          setEdit((prev) => !prev);
          setTimeout(() => {
            setUpdated((prev) => !prev);
          }, 1000);
      
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setError(error.response?.data?.error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="text-red-500 text-sm">Loading...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className={`${updated ? "hidden" : ""} space-y-4 flex flex-col justify-center items-center`}
    >
      <div>
        <label className="text-black block mb-1" htmlFor="username">
          Username
        </label>
        <input
          className="text-black border rounded-md w-full px-2 py-1"
          type="text"
          id="username"
          name="username"
          placeholder="Enter username  "
          value={formData.username}
          onChange={handleInputChange}
        />

        <label className="text-black block mb-1" htmlFor="phone">
          Phone Number
        </label>
        <input
          className="text-black border rounded-md w-full px-2 py-1"
          inputMode="numeric"
          type="number"
          id="phone"
          name="phone"
          placeholder="0xx-xxx-xxxx"
          value={formData.phone}
          onChange={handleInputChange}
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md px-4 mt-2 w-full py-2"
      >
        {loading ? "Loading..." : "Save"}
      </button>
    </form>
  );
};

export default UserProfileForm;
