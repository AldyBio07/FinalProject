import Link from "next/link";
import { getCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import axios from "axios";
import { useState, useRef } from "react";
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
  const [modalType, setModalType] = useState(""); // "edit" or "delete"
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedRole, setUpdatedRole] = useState("");
  const [updatedInfo, setUpdatedInfo] = useState({
    name: "",
    email: "",
    profilePictureUrl: "",
    phoneNumber: "",
  });
  const [file, setFile] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Change this to adjust how many items are displayed per page

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    //Manggil API UPLOAD/////////////////////
    setUpdatedInfo((prev) => ({
      ...prev,
      profilePictureUrl: URL.createObjectURL(selectedFile),
    }));
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
      router.replace(router.asPath); // Refresh the page
      closeModal();
    } catch (error) {
      console.error(
        "Error updating user role:",
        error.response?.data || error.message
      );
    }
  };

  const uploadImage = async () => {
    if (!file) {
      console.error("No file selected");
      return null;
    }

    const api =
      "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/upload-image";
    const apiKey = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
    const token = getCookie("token"); // Gunakan getCookie untuk mendapatkan token

    const config = {
      headers: {
        apiKey: apiKey,
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(api, formData, config);
      console.log("Upload successful:", response.data);
      return response.data.data.url; // Sesuaikan dengan struktur response API
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      throw error;
    }
  };

  const handleUpdateUserInfo = async () => {
    try {
      let profilePictureUrl = updatedInfo.profilePictureUrl;

      // Jika ada file yang dipilih, upload terlebih dahulu
      if (file) {
        try {
          profilePictureUrl = await uploadImage();
        } catch (uploadError) {
          alert(`Gagal mengunggah gambar: ${uploadError.message}`);
          return;
        }
      }

      // Persiapkan data untuk update
      const updateData = {
        ...updatedInfo,
        profilePictureUrl: profilePictureUrl,
      };

      // Kirim update profil
      await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-profile/${selectedUser.id}`,
        updateData,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );

      router.replace(router.asPath); // Refresh the page
      closeModal();
    } catch (error) {
      console.error("Error updating user information:", error);
      alert(`Gagal memperbarui profil: ${error.message}`);
    }
  };

  // Calculate current users for the current page
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Calculate total pages
  const totalPages = Math.ceil(users.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen p-6 text-gray-900 bg-gray-100">
      <h1 className="mb-4 text-3xl font-extrabold text-center text-blue-600">
        User List
      </h1>
      <button
        onClick={handleLogout}
        className="px-4 py-2 mb-10 font-semibold text-white bg-red-500 rounded"
      >
        Logout
      </button>

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
              <p className="text-sm font-semibold text-blue-500">{user.role}</p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => openModal("edit-info", user)}
                  className="px-4 py-2 font-semibold text-white bg-green-500 rounded"
                >
                  Edit Info
                </button>
                <button
                  onClick={() => openModal("edit", user)}
                  className="px-4 py-2 font-semibold text-white bg-blue-500 rounded"
                >
                  Edit Role
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      <div className="flex justify-center mt-6">
        {totalPages > 1 && (
          <>
            {/* First Page Button */}
            <button
              onClick={() => handlePageChange(1)}
              className={`px-3 py-1 mx-1 font-semibold text-white rounded ${
                currentPage === 1 ? "bg-blue-500" : "bg-gray-500"
              }`}
            >
              1
            </button>

            {/* Left Ellipsis */}
            {currentPage > 4 && <span className="px-2">...</span>}

            {/* Pages around the current page */}
            {Array.from({ length: 5 }, (_, i) => {
              const page = currentPage - 2 + i;
              if (page > 1 && page < totalPages) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 mx-1 font-semibold text-white rounded ${
                      currentPage === page ? "bg-blue-500" : "bg-gray-500"
                    }`}
                  >
                    {page}
                  </button>
                );
              }
              return null;
            })}

            {/* Right Ellipsis */}
            {currentPage < totalPages - 3 && <span className="px-2">...</span>}

            {/* Last Page Button */}
            <button
              onClick={() => handlePageChange(totalPages)}
              className={`px-3 py-1 mx-1 font-semibold text-white rounded ${
                currentPage === totalPages ? "bg-blue-500" : "bg-gray-500"
              }`}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
            {modalType === "edit" ? (
              <>
                <h2 className="mb-4 text-xl font-bold">Edit User Role</h2>
                <p className="mb-4 text-sm text-gray-600">
                  Name: {selectedUser?.name}
                </p>
                <p className="mb-4 text-sm text-gray-600">
                  Email: {selectedUser?.email}
                </p>
                <label className="block mb-2 text-sm font-semibold">
                  Role:
                </label>
                <select
                  value={updatedRole}
                  onChange={handleRoleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={handleUpdateUser}
                    className="px-4 py-2 font-semibold text-white bg-green-500 rounded"
                  >
                    Update Role
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 font-semibold text-white bg-red-500 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : modalType === "edit-info" ? (
              <>
                <h2 className="mb-4 text-xl font-bold">
                  Edit User Information
                </h2>

                {/* Tambahkan preview gambar dan input file */}
                <div className="mb-4 text-center">
                  <img
                    src={updatedInfo.profilePictureUrl}
                    alt="Profile"
                    className="object-cover w-32 h-32 mx-auto mb-2 rounded-full"
                  />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="w-full p-2 border rounded"
                  />
                </div>

                {Object.keys(updatedInfo)
                  .filter((key) => key !== "profilePictureUrl")
                  .map((key) => (
                    <div key={key} className="mb-4">
                      <label className="block mb-1 text-sm font-semibold">
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                      </label>
                      <input
                        type="text"
                        name={key}
                        value={updatedInfo[key]}
                        onChange={handleInfoChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  ))}

                <div className="flex justify-between mt-4">
                  <button
                    onClick={handleUpdateUserInfo}
                    className="px-4 py-2 font-semibold text-white bg-green-500 rounded"
                  >
                    Update Info
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 font-semibold text-white bg-red-500 rounded"
                  >
                    Cancel
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
