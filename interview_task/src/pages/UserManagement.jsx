
import React, { useEffect, useState } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "user" });
  const [editMode, setEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load users.");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        // Update user
        await axios.put(
          `http://localhost:5000/api/users/${editUserId}`,
          { name: formData.name, email: formData.email, role: formData.role },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create new user
        await axios.post(
          "http://localhost:5000/api/users/create",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchUsers();
      setFormData({ name: "", email: "", password: "", role: "user" });
      setEditMode(false);
    } catch (err) {
      setError("Operation failed.");
    }
  };

  const startEditUser = (user) => {
    setFormData({ name: user.name, email: user.email, role: user.role });
    setEditUserId(user._id);
    setEditMode(true);
  };

  const cancelEdit = () => {
    setFormData({ name: "", email: "", password: "", role: "user" });
    setEditMode(false);
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      setError("Failed to delete user.");
    }
  };

  const blockUser = async (userId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/users/${userId}/block`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch {
      setError("Failed to block user.");
    }
  };

  const unblockUser = async (userId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/users/${userId}/unblock`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch {
      setError("Failed to unblock user.");
    }
  };

  if (loading) return <p className="text-center text-xl">Loading...</p>;
  if (error) return <p className="text-center text-xl text-red-500">{error}</p>;

  return (
    
    <div className="max-w-7xl mx-auto px-4 py-8">
  <h2 className="text-3xl font-semibold text-center mb-8">User Management</h2>

 
  <form
    onSubmit={handleCreateOrUpdate}
    className="bg-white shadow-lg p-8 rounded-xl mb-10 max-w-2xl mx-auto space-y-6"
  >
    <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
      {editMode ? "Edit User" : "Create User"}
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col">
        <label className="text-gray-700 mb-1 font-medium">Name</label>
        <input
          name="name"
          placeholder="John Doe"
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700 mb-1 font-medium">Email</label>
        <input
          name="email"
          type="email"
          placeholder="john@example.com"
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>

      {!editMode && (
        <div className="flex flex-col md:col-span-2">
          <label className="text-gray-700 mb-1 font-medium">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter a strong password"
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
      )}

      <div className="flex flex-col md:col-span-2">
        <label className="text-gray-700 mb-1 font-medium">Role</label>
        <select
          name="role"
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={formData.role}
          onChange={handleInputChange}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
    </div>

    <div className="flex justify-end gap-4 mt-6">
      {editMode && (
        <button
          type="button"
          onClick={cancelEdit}
          className="px-6 py-3 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
        >
          Cancel
        </button>
      )}
      <button
        type="submit"
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {editMode ? "Update" : "Create"}
      </button>
    </div>
  </form>

  {/* User Grid (kept same for now) */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {users.map((user) => (
      <div
        key={user._id}
        className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 flex flex-col items-center"
      >
        <div className="mb-4 text-center">
          <h3 className="text-lg font-bold">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-500">Role: {user.role}</p>
        </div>
        <div className="flex flex-col gap-2 w-full">
          {user.blocked ? (
            <button
              onClick={() => unblockUser(user._id)}
              className="py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Unblock
            </button>
          ) : (
            <button
              onClick={() => blockUser(user._id)}
              className="py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Block
            </button>
          )}
          <button
            onClick={() => startEditUser(user)}
            className="py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Edit
          </button>
          <button
            onClick={() => deleteUser(user._id)}
            className="py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

  );
};

export default UserManagement;
