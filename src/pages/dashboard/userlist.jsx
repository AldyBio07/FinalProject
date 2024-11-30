import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getCookie, deleteCookie } from "cookies-next";
import { uploadImage } from "@/helper/uploadImage";
import {
  Pencil,
  Trash2,
  X,
  Upload,
  Plus,
  Save,
  PlusCircle,
} from "lucide-react";
import { HiSearch, HiOutlineX, HiClipboardList } from "react-icons/hi";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export async function getServerSideProps({ req, res }) {
  const token = getCookie("token", { req, res });
  if (!token) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  try {
    const userRes = await axios.get(
      "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/all-user",
      {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      props: {
        users: userRes.data.data,
      },
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
}

const AdminUser = ({ users }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedRole, setUpdatedRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const itemsPerPage = 6;
  const [updatedInfo, setUpdatedInfo] = useState({
    name: "",
    email: "",
    profilePictureUrl: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchQuery, users]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImage(file);
      setUpdatedInfo((prev) => ({
        ...prev,
        profilePictureUrl: imageUrl,
      }));
    } catch (error) {
      showNotification("Failed to upload image", true);
    }
  };

  const openModal = (type, user) => {
    setModalType(type);
    setSelectedUser(user);
    setUpdatedRole(user.role);
    if (type === "edit-info") {
      setUpdatedInfo({
        name: user.name,
        email: user.email,
        profilePictureUrl: user.profilePictureUrl,
        phoneNumber: user.phoneNumber,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setUpdatedRole("");
  };

  const showNotification = (message, isError = false) => {
    setNotification({
      message,
      type: isError ? "error" : "success",
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateUser = async () => {
    setLoading(true);
    try {
      await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-user-role/${selectedUser.id}`,
        { role: updatedRole },
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      showNotification("User role updated successfully");
      router.replace(router.asPath);
      closeModal();
    } catch (error) {
      showNotification("Failed to update user role", true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserInfo = async () => {
    setLoading(true);
    try {
      await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-profile`,
        updatedInfo,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      showNotification("User information updated successfully");
      router.replace(router.asPath);
      closeModal();
    } catch (error) {
      showNotification("Failed to update user information", true);
    } finally {
      setLoading(false);
    }
  };

  // Pagination calculations
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Background Decorations */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 transform -translate-y-1/2 rounded-full w-96 h-96 bg-gradient-to-br from-blue-100/20 to-transparent blur-3xl translate-x-1/4" />
        <div className="absolute bottom-0 left-0 transform translate-y-1/2 rounded-full w-96 h-96 bg-gradient-to-tr from-blue-100/20 to-transparent blur-3xl -translate-x-1/4" />
      </div>

      {/* Sidebar */}
      <div className="fixed left-0 z-30 w-64 h-full">
        <Sidebar role="admin" />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 ml-64">
        {/* Fixed Navbar */}
        <div className="fixed top-0 right-0 z-20 bg-white shadow-sm left-64">
          <Navbar role="admin" />
        </div>

        {/* Notification */}
        {notification && (
          <div
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-2xl shadow-lg ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            } transition-all duration-300 transform`}
          >
            {notification.message}
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 mt-16 mb-6">
          {/* Page Header & Search */}
          <div className="p-6 mb-8 bg-white shadow-sm rounded-2xl">
            <div className="max-w-4xl mx-auto">
              <h1 className="mb-6 text-3xl font-extrabold text-[#101827]">
                User Management
              </h1>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                    <HiSearch className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search users..."
                    className="w-full py-3 pl-12 pr-10 text-gray-900 transition duration-200 border-2 border-gray-200 bg-gray-50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-gray-600"
                    >
                      <HiOutlineX className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Users Grid */}
          {currentUsers.length === 0 ? (
            <div className="p-8 text-center bg-white shadow-sm rounded-2xl">
              <p className="text-xl font-semibold text-gray-600">
                No users found
              </p>
              <p className="mt-2 text-gray-500">
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3">
              {currentUsers.map((user) => (
                <div
                  key={user.id}
                  className="relative overflow-hidden transition-all duration-300 bg-[#101827] group rounded-2xl hover:bg-[#D9E2E8]"
                >
                  {/* Image Section */}
                  <div className="relative h-96 woverflow-hidden">
                    <img
                      src={user.profilePictureUrl}
                      alt={user.name}
                      className="object-cover w-full h-full transition-transform duration-500"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="p-5">
                    {/* Role Badge */}
                    <div className="mb-3">
                      <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 rounded-full bg-blue-50">
                        {user.role}
                      </span>
                    </div>

                    {/* Title & Info */}
                    <h3 className="mb-2 text-lg font-bold text-[#FF6910] line-clamp-1">
                      {user.name}
                    </h3>
                    <p className="mb-4 text-sm text-gray-500 line-clamp-2">
                      {user.email}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      {/* <button
                        onClick={() => openModal("edit-info", user)}
                        className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit Info
                      </button> */}
                      <button
                        onClick={() => openModal("edit", user)}
                        className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-sm font-medium text-blue-600 transition-colors duration-200 rounded-lg bg-blue-50 hover:bg-blue-100"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit Role
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="sticky flex justify-center bottom-6">
              <div className="inline-flex bg-white divide-x divide-gray-200 shadow-sm rounded-xl">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 transition duration-200 hover:bg-gray-50 rounded-l-xl disabled:opacity-50"
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 transition duration-200 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 transition duration-200 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 transition duration-200 hover:bg-gray-50 rounded-r-xl disabled:opacity-50"
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 transition-opacity bg-black/60 backdrop-blur-sm" />

          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative w-full max-w-2xl transition-all transform bg-white shadow-2xl rounded-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {modalType === "edit" ? (
                    <div className="flex items-center gap-2">
                      <Pencil className="w-6 h-6 text-blue-500" />
                      <span>Edit User Role</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Pencil className="w-6 h-6text-blue-500" />
                      <span>Edit User Info</span>
                    </div>
                  )}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 transition-colors rounded-full hover:text-gray-600 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              {modalType === "edit" ? (
                <div className="p-6 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <p className="px-4 py-3 text-gray-900 bg-gray-50 rounded-xl">
                      {selectedUser?.name}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="px-4 py-3 text-gray-900 bg-gray-50 rounded-xl">
                      {selectedUser?.email}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <select
                      value={updatedRole}
                      onChange={(e) => setUpdatedRole(e.target.value)}
                      className="w-full px-4 py-3 transition-all border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {/* Image Upload Section */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Profile Picture
                    </label>
                    {updatedInfo.profilePictureUrl && (
                      <div className="relative overflow-hidden border-2 border-gray-100 rounded-lg aspect-video">
                        <img
                          src={updatedInfo.profilePictureUrl}
                          alt="Profile Preview"
                          className="object-cover w-full h-full"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setUpdatedInfo((prev) => ({
                              ...prev,
                              profilePictureUrl: "",
                            }))
                          }
                          className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white rounded-full text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <div className="relative">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center px-6 py-8 text-center transition-colors border-2 border-gray-200 border-dashed rounded-lg hover:bg-gray-50">
                        <div className="p-3 mb-2 text-blue-600 rounded-full bg-blue-50">
                          <Upload className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          Click to upload or drag and drop
                        </span>
                        <span className="mt-1 text-xs text-gray-500">
                          SVG, PNG, JPG or GIF (max. 800x400px)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* User Info Fields */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={updatedInfo.name}
                        onChange={(e) =>
                          setUpdatedInfo((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 transition-all border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={updatedInfo.email}
                        onChange={(e) =>
                          setUpdatedInfo((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 transition-all border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={updatedInfo.phoneNumber}
                        onChange={(e) =>
                          setUpdatedInfo((prev) => ({
                            ...prev,
                            phoneNumber: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 transition-all border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={
                    modalType === "edit"
                      ? handleUpdateUser
                      : handleUpdateUserInfo
                  }
                  disabled={loading}
                  className={`
                    px-5 py-2.5 text-sm font-medium text-white rounded-lg
                    transition-all focus:outline-none focus:ring-4 focus:ring-blue-100
                    ${
                      loading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }
                  `}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>
                        {modalType === "edit"
                          ? "Updating Role..."
                          : "Updating Info..."}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      <span>
                        {modalType === "edit" ? "Update Role" : "Update Info"}
                      </span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUser;
