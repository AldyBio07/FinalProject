import Link from "next/link";
import { getCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { uploadImage } from "@/helper/uploadImage";
import { HiSearch, HiOutlineX } from "react-icons/hi";
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

const UserList = ({ users }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedRole, setUpdatedRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [updatedInfo, setUpdatedInfo] = useState({
    name: "",
    email: "",
    profilePictureUrl: "",
    phoneNumber: "",
  });
  const [file, setFile] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Effect to filter users when search query changes
  useEffect(() => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchQuery, users]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (!selectedFile) {
      return;
    }

    try {
      const uploadedImageUrl = await uploadImage(selectedFile);
      setUpdatedInfo((prev) => ({
        ...prev,
        profilePictureUrl: uploadedImageUrl,
      }));
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert(`Failed to upload image: ${error.message}`);
    }
  };

  const handleLogout = () => {
    deleteCookie("token");
    router.push("/auth/login");
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

  const handleRoleChange = (e) => {
    setUpdatedRole(e.target.value);
  };

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setUpdatedInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateUser = async () => {
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
      router.replace(router.asPath);
      closeModal();
    } catch (error) {
      console.error(
        "Error updating user role:",
        error.response?.data || error.message
      );
    }
  };

  const handleUpdateUserInfo = async () => {
    try {
      let profilePictureUrl = updatedInfo.profilePictureUrl;

      const updateData = {
        ...updatedInfo,
        profilePictureUrl: profilePictureUrl,
      };

      await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-profile`,
        updateData,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );

      router.replace(router.asPath);
      closeModal();
    } catch (error) {
      console.error("Error updating user information:", error);
      alert(`Failed to update profile: ${error.message}`);
    }
  };

  // Calculate current users for pagination
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Background Decorations */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Top-right decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-3xl transform -translate-y-1/2 translate-x-1/4" />
        {/* Bottom-left decoration */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-100/20 to-transparent rounded-full blur-3xl transform translate-y-1/2 -translate-x-1/4" />
        {/* Center decoration */}
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-50/10 via-white/5 to-blue-50/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDBNIDAgMjAgTCA0MCAyMCBNIDIwIDAgTCAyMCA0MCBNIDAgMzAgTCA0MCAzMCBNIDMwIDAgTCAzMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjA0N2ZmMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
      </div>
      {/* Sidebar - Fixed */}
      <div className="fixed left-0 z-30 w-64 h-full">
        <Sidebar role="admin" />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 ml-64">
        {/* Fixed Navbar */}
        <div className="fixed top-0 right-0 z-20 bg-white shadow-sm left-64">
          <Navbar role="admin" />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 mt-16 mb-6">
          {/* Page Header & Search */}
          <div className="p-6 mb-8 bg-white shadow-sm rounded-2xl">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-extrabold text-[#0064D2] mb-6">
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
                    placeholder="Search by username..."
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
                  className="overflow-hidden transition duration-300 bg-white shadow-sm rounded-2xl hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="aspect-w-16 aspect-h-12">
                    <img
                      src={user.profilePictureUrl}
                      alt={user.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="mb-1 text-lg font-bold text-gray-900">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="inline-flex px-3 py-1 mt-2 rounded-full bg-blue-50">
                      <span className="text-sm font-medium text-[#0064D2]">
                        {user.role}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <button
                        onClick={() => openModal("edit-info", user)}
                        className="px-4 py-2.5 text-sm font-medium text-white bg-green-500 rounded-xl hover:bg-green-600 transition duration-200"
                      >
                        Edit Info
                      </button>
                      <button
                        onClick={() => openModal("edit", user)}
                        className="px-4 py-2.5 text-sm font-medium text-white bg-[#0064D2] rounded-xl hover:bg-blue-700 transition duration-200"
                      >
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
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 transition duration-200 hover:bg-gray-50 rounded-l-xl disabled:opacity-50"
                >
                  First
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 transition duration-200 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 transition duration-200 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl">
            <div className="p-6">
              {modalType === "edit" ? (
                <>
                  <h2 className="mb-6 text-xl font-bold text-gray-900">
                    Edit User Role
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <p className="mt-1 text-gray-600">{selectedUser?.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <p className="mt-1 text-gray-600">
                        {selectedUser?.email}
                      </p>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Role
                      </label>
                      <select
                        value={updatedRole}
                        onChange={handleRoleChange}
                        className="w-full p-3 transition duration-200 border-2 border-gray-200 bg-gray-50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 mt-8">
                    <button
                      onClick={closeModal}
                      className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateUser}
                      className="px-6 py-2.5 text-sm font-medium text-white bg-[#0064D2] rounded-xl hover:bg-blue-700 transition duration-200"
                    >
                      Update Role
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="mb-6 text-xl font-bold text-gray-900">
                    Edit User Information
                  </h2>
                  <div className="space-y-6">
                    {/* Profile Image Section */}
                    <div className="text-center">
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <img
                          src={updatedInfo.profilePictureUrl}
                          alt="Profile"
                          className="object-cover w-full h-full rounded-full ring-4 ring-blue-100"
                        />
                      </div>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="w-full p-2 text-sm text-gray-600 border-2 border-gray-200 bg-gray-50 rounded-xl"
                      />
                    </div>

                    {/* Form Fields */}
                    {Object.keys(updatedInfo)
                      .filter((key) => key !== "profilePictureUrl")
                      .map((key) => (
                        <div key={key}>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </label>
                          <input
                            type="text"
                            name={key}
                            value={updatedInfo[key]}
                            onChange={handleInfoChange}
                            className="w-full p-3 transition duration-200 border-2 border-gray-200 bg-gray-50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                      ))}
                  </div>

                  <div className="flex justify-end gap-4 mt-8">
                    <button
                      onClick={closeModal}
                      className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateUserInfo}
                      className="px-6 py-2.5 text-sm font-medium text-white bg-[#0064D2] rounded-xl hover:bg-blue-700 transition duration-200"
                    >
                      Update Info
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
