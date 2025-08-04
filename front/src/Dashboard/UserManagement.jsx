// src/pages/UserManagement.js

import React, { useEffect, useState } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/users",
          {
            withCredentials: true,
          }
        );
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError("Login First");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Function to handle role change
const handleRoleChange = async (userId, newRole) => {
  try {
    await axios.put(
      `http://localhost:5000/api/users/${userId}/role`,
      { newRole }, // Send the newRole in the request body
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Update local state
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, role: newRole } : user
      )
    );
  } catch (err) {
    console.error("Failed to update user role", err);
    // Add user feedback here
    alert(
      `Failed to update role: ${err.response?.data?.message || err.message}`
    );
  }
};

// Function to handle suspend/unsuspend
const handleSuspendToggle = async (userId, isSuspended) => {
  try {
    const url = `http://localhost:5000/api/users/${userId}/${isSuspended ? 'unsuspend' : 'suspend'}`;
    await axios.put(
      url,
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, isSuspended: !isSuspended } : user
      )
    );
  } catch (err) {
    alert(
      `Failed to ${isSuspended ? 'unsuspend' : 'suspend'} user: ${err.response?.data?.message || err.message}`
    );
  }
};
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center mt-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                  {user.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                  <button
                    onClick={() => handleRoleChange(user._id, "user")}
                    className={`px-3 py-1 rounded-md text-xs font-medium ${
                      user.role === "user"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                    disabled={user.role === "user"}
                  >
                    Set as User
                  </button>
                  <button
                    onClick={() => handleRoleChange(user._id, "veterinarian")}
                    className={`px-3 py-1 rounded-md text-xs font-medium ${
                      user.role === "veterinarian"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                    disabled={user.role === "veterinarian"}
                  >
                    Set as Veterinarian
                  </button>
                  <button
                    onClick={() => handleSuspendToggle(user._id, user.isSuspended)}
                    className={`px-3 py-1 rounded-md text-xs font-medium ${
                      user.isSuspended
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    }`}
                  >
                    {user.isSuspended ? "Unsuspend" : "Suspend"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
