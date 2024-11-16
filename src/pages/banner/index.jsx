import { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { uploadImage } from "@/helper/uploadImage";
import { HiOutlineGlobeAlt, HiUpload, HiPhotograph } from "react-icons/hi";
import Link from "next/link";

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
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 6;

  const fetchBanners = async () => {
    try {
      setLoading(true);
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
      showNotification("Failed to fetch banners", true);
    } finally {
      setLoading(false);
    }
  };

  const createBanner = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      resetForm();
      setIsModalOpen(false);
      fetchBanners();
      showNotification("Banner created successfully!");
    } catch (error) {
      showNotification("Failed to create banner", true);
    } finally {
      setLoading(false);
    }
  };

  const updateBanner = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      resetForm();
      setIsModalOpen(false);
      fetchBanners();
      showNotification("Banner updated successfully!");
    } catch (error) {
      showNotification("Failed to update banner", true);
    } finally {
      setLoading(false);
    }
  };

  const deleteBanner = async (bannerId) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    setLoading(true);
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
      fetchBanners();
      showNotification("Banner deleted successfully!");
    } catch (error) {
      showNotification("Failed to delete banner", true);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", imageUrl: "" });
    setSelectedBanner(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showNotification = (message, isError = false) => {
    setNotification({
      message,
      type: isError ? "error" : "success",
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        imageUrl,
      }));
    } catch (error) {
      showNotification("Failed to upload image", true);
    }
  };

  const paginatedBanners = banners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-[#F5F7FF]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <span className="text-[#0064D2] text-3xl font-black">travel</span>
              <span className="text-[#FF6B6B] text-3xl font-black">
                .journey
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 space-x-2 text-gray-600 transition duration-200 rounded-full hover:bg-gray-50">
                <HiOutlineGlobeAlt className="w-5 h-5" />
                <span className="text-sm">English</span>
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  resetForm();
                  setIsModalOpen(true);
                }}
                className="flex items-center px-6 py-2 space-x-2 text-white transition duration-200 bg-blue-600 rounded-full hover:bg-blue-700"
              >
                <HiPhotograph className="w-5 h-5" />
                <span>Add Banner</span>
              </button>
            </div>
          </div>
        </div>
      </header>

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
      <main className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedBanners.map((banner) => (
            <div
              key={banner.id}
              className="overflow-hidden transition-all duration-300 bg-white border border-gray-100 rounded-2xl hover:shadow-xl transform hover:scale-[1.02]"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={banner.imageUrl}
                  alt={banner.name}
                  className="object-cover w-full h-full transition-transform duration-300 transform hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  {banner.name}
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setSelectedBanner(banner);
                      setFormData({
                        name: banner.name,
                        imageUrl: banner.imageUrl,
                      });
                      setIsModalOpen(true);
                    }}
                    className="flex-1 py-2.5 px-4 text-blue-600 font-medium transition bg-blue-50 rounded-xl hover:bg-blue-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteBanner(banner.id)}
                    className="flex-1 py-2.5 px-4 text-red-600 font-medium transition bg-red-50 rounded-xl hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {banners.length > itemsPerPage && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from(
              { length: Math.ceil(banners.length / itemsPerPage) },
              (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-xl
                    ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 mx-4 bg-white rounded-2xl">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              {isEditing ? "Edit Banner" : "Add New Banner"}
            </h2>
            <form onSubmit={isEditing ? updateBanner : createBanner}>
              <div className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Banner Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-black transition duration-200 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Banner Image
                  </label>
                  {formData.imageUrl && (
                    <div className="relative mb-4 overflow-hidden rounded-xl">
                      <img
                        src={formData.imageUrl}
                        alt="Banner Preview"
                        className="object-cover w-full h-48"
                      />
                    </div>
                  )}
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex items-center justify-center px-6 py-4 text-sm text-gray-600 transition duration-200 border-2 border-gray-200 border-dashed rounded-xl hover:bg-gray-50">
                      <HiUpload className="w-5 h-5 mr-2" />
                      <span>Click or drag image to upload</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8 space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 text-gray-700 transition duration-200 bg-gray-100 rounded-xl hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2.5 text-white transition duration-200 rounded-xl
                    ${
                      loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin" />
                      {isEditing ? "Updating..." : "Creating..."}
                    </div>
                  ) : isEditing ? (
                    "Update Banner"
                  ) : (
                    "Create Banner"
                  )}
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
