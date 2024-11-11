import { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";

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
    // Fetch banners
    const bannersResponse = await axios.get(
      "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/banners",
      {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      props: {
        initialBanners: bannersResponse.data.data || [],
        token,
      },
    };
  } catch (error) {
    console.error("Error fetching banners:", error);
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
}

const BannerManagement = ({ initialBanners = [], token }) => {
  const [banners, setBanners] = useState(initialBanners);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch banners
  const fetchBanners = async () => {
    try {
      const response = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/banners",
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBanners(response.data.data || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
      showNotification("Gagal mengambil daftar banner", true);
    }
  };

  // Create Banner
  const createBanner = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-banner",
        formData,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reset form and close modal
      resetForm();
      setIsModalOpen(false);

      // Refresh banners
      fetchBanners();

      // Show notification
      showNotification("Banner berhasil dibuat!");
    } catch (error) {
      console.error("Error creating banner:", error);
      showNotification("Gagal membuat banner", true);
    }
  };

  // Update Banner
  const updateBanner = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-banner/${selectedBanner.id}`,
        formData,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reset form and close modal
      resetForm();
      setIsModalOpen(false);

      // Refresh banners
      fetchBanners();

      // Show notification
      showNotification("Banner berhasil diperbarui!");
    } catch (error) {
      console.error("Error updating banner:", error);
      showNotification("Gagal memperbarui banner", true);
    }
  };

  // Delete Banner
  const deleteBanner = async (bannerId) => {
    try {
      await axios.delete(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-banner/${bannerId}`,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh banners
      fetchBanners();

      // Show notification
      showNotification("Banner berhasil dihapus!");
    } catch (error) {
      console.error("Error deleting banner:", error);
      showNotification("Gagal menghapus banner", true);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      name: "",
      imageUrl: "",
    });
    setSelectedBanner(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Show notification
  const showNotification = (message, isError = false) => {
    setNotification({
      message,
      type: isError ? "error" : "success",
    });
    setTimeout(() => setNotification(null), 3000);
  };

  // Open modal for creating banner
  const openCreateModal = () => {
    setIsEditing(false);
    resetForm();
    setIsModalOpen(true);
  };

  // Open modal for editing banner
  const openEditModal = (banner) => {
    setIsEditing(true);
    setSelectedBanner(banner);
    setFormData({
      name: banner.name,
      imageUrl: banner.imageUrl,
    });
    setIsModalOpen(true);
  };

  // Paginated banners
  const paginatedBanners = banners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen font-sans bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container flex items-center justify-between px-6 py-4 mx-auto">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">
              Banner Management
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={openCreateModal}
              className="flex items-center px-4 py-2 text-white transition bg-blue-600 rounded-full hover:bg-blue-700"
            >
              + Tambah Banner
            </button>
          </div>
        </div>
      </nav>

      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Main Content */}
      <div className="container px-6 py-8 mx-auto">
        {/* Banners */}
        <div className="grid gap-6 md:grid-cols-3">
          {paginatedBanners.map((banner) => (
            <div
              key={banner.id}
              className="overflow-hidden transition transform bg-white rounded-lg shadow-md hover:scale-105 hover:shadow-xl"
            >
              <img
                src={banner.imageUrl}
                alt={banner.name}
                className="object-cover w-full h-48"
              />
              <div className="p-4">
                <h3 className="mb-2 text-lg font-bold text-gray-800">
                  {banner.name}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(banner)}
                    className="flex-1 py-2 text-blue-600 transition bg-blue-100 rounded-lg hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteBanner(banner.id)}
                    className="flex-1 py-2 text-red-600 transition bg-red-100 rounded-lg hover:bg-red-200"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from(
            { length: Math.ceil(banners.length / itemsPerPage) },
            (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-full ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      </div>

      {/* Modal for Create/Edit Banner */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center text-black">
          <div className="p-6 bg-white rounded-lg shadow-lg w-96">
            <h2 className="mb-4 text-xl font-bold">
              {isEditing ? "Edit Banner" : "Tambah Banner"}
            </h2>
            <form onSubmit={isEditing ? updateBanner : createBanner}>
              <div className="mb-4 ">
                <label className="block mb-2" htmlFor="name">
                  Nama Banner
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2" htmlFor="imageUrl">
                  URL Gambar
                </label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 mr-2 text-gray-700 bg-gray-300 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-500 rounded"
                >
                  {isEditing ? "Perbarui" : "Buat"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManagement;
