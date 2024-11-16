import { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { uploadImage } from "@/helper/uploadImage";
import { HiOutlineGlobeAlt } from "react-icons/hi";

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
    const promosResponse = await axios.get(
      "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promos",
      {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      props: {
        initialPromos: promosResponse.data.data || [],
        token,
      },
    };
  } catch (error) {
    console.error("Error fetching promos:", error);
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
}

const PromoManagement = ({ initialPromos = [], token }) => {
  const [promos, setPromos] = useState(initialPromos);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    terms_condition: "",
    promo_code: "",
    promo_discount_price: "",
    minimum_claim_price: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 6;

  // Fetch promos
  const fetchPromos = async () => {
    try {
      const response = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promos",
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPromos(response.data.data || []);
    } catch (error) {
      console.error("Error fetching promos:", error);
      showNotification("Failed to fetch promos", true);
    }
  };

  // Create Promo
  const createPromo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        promo_discount_price: Number(formData.promo_discount_price),
        minimum_claim_price: Number(formData.minimum_claim_price),
      };

      await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-promo",
        payload,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      resetForm();
      setIsModalOpen(false);
      fetchPromos();
      showNotification("Promo created successfully!");
    } catch (error) {
      console.error("Error creating promo:", error);
      showNotification(
        error.response?.data?.message || "Failed to create promo",
        true
      );
    } finally {
      setLoading(false);
    }
  };

  // Update Promo
  const updatePromo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        promo_discount_price: Number(formData.promo_discount_price),
        minimum_claim_price: Number(formData.minimum_claim_price),
      };

      await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-promo/${selectedPromo.id}`,
        payload,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      resetForm();
      setIsModalOpen(false);
      fetchPromos();
      showNotification("Promo updated successfully!");
    } catch (error) {
      console.error("Error updating promo:", error);
      showNotification(
        error.response?.data?.message || "Failed to update promo",
        true
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete Promo
  const deletePromo = async (promoId) => {
    if (!window.confirm("Are you sure you want to delete this promo?")) return;

    setLoading(true);
    try {
      await axios.delete(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-promo/${promoId}`,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchPromos();
      showNotification("Promo deleted successfully!");
    } catch (error) {
      console.error("Error deleting promo:", error);
      showNotification(
        error.response?.data?.message || "Failed to delete promo",
        true
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      terms_condition: "",
      promo_code: "",
      promo_discount_price: "",
      minimum_claim_price: "",
    });
    setSelectedPromo(null);
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

  // Handle file upload
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    try {
      const uploadedImageUrl = await uploadImage(selectedFile);
      setFormData((prev) => ({
        ...prev,
        imageUrl: uploadedImageUrl,
      }));
    } catch (error) {
      console.error("Failed to upload image:", error);
      showNotification("Failed to upload image", true);
    }
  };

  // Modal controls
  const openCreateModal = () => {
    setIsEditing(false);
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (promo) => {
    setIsEditing(true);
    setSelectedPromo(promo);
    setFormData({
      title: promo.title,
      description: promo.description,
      imageUrl: promo.imageUrl,
      terms_condition: promo.terms_condition,
      promo_code: promo.promo_code,
      promo_discount_price: promo.promo_discount_price,
      minimum_claim_price: promo.minimum_claim_price,
    });
    setIsModalOpen(true);
  };

  // Pagination
  const paginatedPromos = promos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen font-sans bg-[#F5F7FF]">
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
            </div>
          </div>
        </div>
      </header>

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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Promo Management</h1>
          <button
            onClick={openCreateModal}
            className="px-6 py-3 text-white transition duration-200 bg-blue-600 rounded-full hover:bg-blue-700 active:transform active:scale-[0.99] shadow-lg shadow-blue-200"
          >
            + Add New Promo
          </button>
        </div>

        {/* Promos Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedPromos.map((promo) => (
            <div
              key={promo.id}
              className="overflow-hidden bg-white rounded-2xl shadow-lg transform transition duration-300 hover:scale-[1.02]"
            >
              <img
                src={promo.imageUrl}
                alt={promo.title}
                className="object-cover w-full h-48"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {promo.title}
                  </h3>
                  <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
                    {promo.promo_code}
                  </span>
                </div>
                <p className="mb-4 text-gray-600 line-clamp-2">
                  {promo.description}
                </p>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-500">Discount</span>
                    <span className="font-medium text-blue-600">
                      ${promo.promo_discount_price}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Min. Claim</span>
                    <span className="font-medium text-gray-900">
                      ${promo.minimum_claim_price}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(promo)}
                    className="flex-1 py-2 text-blue-600 transition bg-blue-100 rounded-lg hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePromo(promo.id)}
                    className="flex-1 py-2 text-red-600 transition bg-red-100 rounded-lg hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from(
            { length: Math.ceil(promos.length / itemsPerPage) },
            (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-full transition duration-200 ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl p-6 bg-white rounded-2xl">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              {isEditing ? "Edit Promo" : "Create New Promo"}
            </h2>
            <form
              onSubmit={isEditing ? updatePromo : createPromo}
              className="space-y-6"
            >
              {/* Title */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  rows="4"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Terms and Conditions */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Terms and Conditions
                </label>
                <textarea
                  name="terms_condition"
                  value={formData.terms_condition}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  rows="3"
                />
              </div>

              {/* Promo Code */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Promo Code
                </label>
                <input
                  type="text"
                  name="promo_code"
                  value={formData.promo_code}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Discount Price */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Discount Price
                </label>
                <input
                  type="number"
                  name="promo_discount_price"
                  value={formData.promo_discount_price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Minimum Claim Price */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Minimum Claim Price
                </label>
                <input
                  type="number"
                  name="minimum_claim_price"
                  value={formData.minimum_claim_price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:transform active:scale-[0.98] transition duration-200"
              >
                {isEditing ? "Update Promo" : "Create Promo"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoManagement;
