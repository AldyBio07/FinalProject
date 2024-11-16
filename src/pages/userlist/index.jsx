import Link from "next/link";
import { getCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { uploadImage } from "@/helper/uploadImage";
import { HiSearch, HiOutlineX } from "react-icons/hi";

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
    <div className="min-h-screen p-6 text-gray-900 bg-[#F5F7FF]">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-extrabold text-center text-[#0064D2]">
          User List
        </h1>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Search Box */}
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <HiSearch className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by username..."
              className="w-full px-4 py-3 pl-12 pr-10 text-gray-900 placeholder-gray-400 transition duration-200 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            )}
          </div>
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-6 py-3 font-semibold text-white transition duration-200 transform bg-red-500 rounded-2xl hover:bg-red-600 active:scale-95"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Users Grid */}
      {currentUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg">
          <p className="text-xl font-semibold text-gray-600">No users found</p>
          <p className="mt-2 text-gray-500">
            Try adjusting your search criteria
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {currentUsers.map((user) => (
            <div
              key={user.id}
              className="overflow-hidden transition duration-300 transform bg-white rounded-lg shadow-lg hover:scale-105 hover:shadow-xl"
            >
              <img
                src={user.profilePictureUrl}
                alt={user.name}
                className="object-cover w-full h-48 rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm font-semibold text-[#0064D2]">
                  {user.role}
                </p>
                <div className="flex justify-between mt-4 space-x-2">
                  <button
                    onClick={() => openModal("edit-info", user)}
                    className="flex-1 py-2 text-white transition duration-200 transform bg-green-500 rounded-lg hover:bg-green-600 active:scale-95"
                  >
                    Edit Info
                  </button>
                  <button
                    onClick={() => openModal("edit", user)}
                    className="flex-1 py-2 text-white transition duration-200 transform bg-[#0064D2] rounded-lg hover:bg-blue-700 active:scale-95"
                  >
                    Edit Role
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="inline-flex rounded-lg shadow">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 text-sm font-medium transition duration-200 ${
                  currentPage === page
                    ? "bg-[#0064D2] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } ${page === 1 ? "rounded-l-lg" : ""} ${
                  page === totalPages ? "rounded-r-lg" : ""
                } border border-gray-200`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg p-6 bg-white shadow-xl rounded-2xl">
            {modalType === "edit" ? (
              <>
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Edit User Role
                </h2>
                <p className="mb-4 text-sm text-gray-600">
                  Name: {selectedUser?.name}
                </p>
                <p className="mb-4 text-sm text-gray-600">
                  Email: {selectedUser?.email}
                </p>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Role:
                </label>
                <select
                  value={updatedRole}
                  onChange={handleRoleChange}
                  className="w-full p-3 border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="flex justify-end mt-6 space-x-4">
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 text-gray-700 transition duration-200 transform bg-gray-100 rounded-xl hover:bg-gray-200 active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateUser}
                    className="px-6 py-2 text-white transition duration-200 transform bg-[#0064D2] rounded-xl hover:bg-blue-700 active:scale-95"
                  >
                    Update Role
                  </button>
                </div>
              </>
            ) : modalType === "edit-info" ? (
              <>
                <h2 className="mb-6 text-xl font-bold text-gray-900">
                  Edit User Information
                </h2>
                <div className="mb-6 text-center">
                  <img
                    src={updatedInfo.profilePictureUrl}
                    alt="Profile"
                    className="object-cover w-32 h-32 mx-auto mb-4 rounded-full"
                  />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="w-full p-2 text-sm text-gray-600 border-2 rounded-xl"
                  />
                </div>
                {Object.keys(updatedInfo)
                  .filter((key) => key !== "profilePictureUrl")
                  .map((key) => (
                    <div key={key} className="mb-4">
                      <label className="block mb-2 text-sm font-semibold text-gray-700">
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                      </label>
                      <input
                        type="text"
                        name={key}
                        value={updatedInfo[key]}
                        onChange={handleInfoChange}
                        className="w-full p-3 border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  ))}
                <div className="flex justify-end mt-6 space-x-4">
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 text-gray-700 transition duration-200 transform bg-gray-100 rounded-xl hover:bg-gray-200 active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateUserInfo}
                    className="px-6 py-2 text-white transition duration-200 transform bg-[#0064D2] rounded-xl hover:bg-blue-700 active:scale-95"
                  >
                    Update Info
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
