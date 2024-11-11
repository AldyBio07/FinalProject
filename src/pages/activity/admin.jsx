import { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { uploadImage } from "@/helper/uploadImage";

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
    // Fetch activities
    const activitiesResponse = await axios.get(
      "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities",
      {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Fetch categories
    const categoriesResponse = await axios.get(
      "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories",
      {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      props: {
        initialActivities: activitiesResponse.data.data || [],
        categories: categoriesResponse.data.data || [],
        token,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
}

const AdminActivity = ({ initialActivities = [], categories = [], token }) => {
  const [activities, setActivities] = useState(initialActivities);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    price_discount: "",
    category_id: "",
    imageUrls: [""],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Refresh activities
  const fetchActivities = async () => {
    try {
      const response = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities",
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setActivities(response.data.data || []);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  // Create Activity
  const createActivity = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-activity",
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

      // Refresh activities
      fetchActivities();

      // Show notification
      showNotification("Aktivitas berhasil dibuat!");
    } catch (error) {
      console.error("Error creating activity:", error);
      showNotification("Gagal membuat aktivitas", true);
    }
  };

  // Update Activity
  const updateActivity = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-activity/${selectedActivity.id}`,
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

      // Refresh activities
      fetchActivities();

      // Show notification
      showNotification("Aktivitas berhasil diperbarui!");
    } catch (error) {
      console.error("Error updating activity:", error);
      showNotification("Gagal memperbarui aktivitas", true);
    }
  };

  // Delete Activity
  const deleteActivity = async (activityId) => {
    try {
      await axios.delete(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-activity/${activityId}`,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh activities
      fetchActivities();

      // Show notification
      showNotification("Aktivitas berhasil dihapus!");
    } catch (error) {
      console.error("Error deleting activity:", error);
      showNotification("Gagal menghapus aktivitas", true);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      price_discount: "",
      category_id: "",
      imageUrls: [""],
    });
    setSelectedActivity(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image URL changes
  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...formData.imageUrls];
    newImageUrls[index] = value;
    setFormData((prev) => ({
      ...prev,
      imageUrls: newImageUrls,
    }));
  };

  // Add image URL input
  const addImageUrlInput = () => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: [...prev.imageUrls, ""],
    }));
  };

  // Remove image URL input
  const removeImageUrlInput = (index) => {
    const newImageUrls = formData.imageUrls.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      imageUrls: newImageUrls,
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

  // Open modal for creating activity
  const openCreateModal = () => {
    setIsEditing(false);
    resetForm();
    setIsModalOpen(true);
  };

  // Open modal for editing activity
  const openEditModal = (activity) => {
    setIsEditing(true);
    setSelectedActivity(activity);
    setFormData({
      title: activity.title,
      description: activity.description,
      price: activity.price,
      price_discount: activity.price_discount,
      category_id: activity.category.id,
      imageUrls: activity.imageUrls,
    });
    setIsModalOpen(true);
  };

  // Paginated activities
  const paginatedActivities = activities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      return;
    }

    try {
      // Upload the image and get the URL
      const uploadedImageUrl = await uploadImage(selectedFile);
      console.log("Uploaded image URL:", uploadedImageUrl);

      // Update the profile picture URL in the state to display the image preview immediately
      setFormData((prev) => ({
        ...prev,
        imageUrls: [uploadedImageUrl],
      }));
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert(`Failed to upload image: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <header className="flex items-center justify-between py-4 mb-6 text-white bg-blue-600">
        <h1 className="ml-4 text-2xl font-bold">Admin - Activity Management</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 mr-4 text-blue-600 bg-white rounded-full"
        >
          + Tambah Aktivitas
        </button>
      </header>

      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white px-4 py-2 rounded-lg z-50`}
        >
          {notification.message}
        </div>
      )}

      {/* Activities Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {paginatedActivities.map((activity) => (
          <div
            key={activity.id}
            className="overflow-hidden bg-white rounded-lg shadow-md"
          >
            <img
              src={activity.imageUrls[0]}
              alt={activity.title}
              className="object-cover w-full h-48"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold">{activity.title}</h3>
              <p className="text-sm text-gray-600">{activity.price_discount}</p>
              <p className="text-sm text-gray-600">{activity.price}</p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => openEditModal(activity)}
                  className="px-3 py-1 text-white bg-blue-500 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteActivity(activity.id)}
                  className="px-3 py-1 text-white bg-red-500 rounded"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Create/Edit Activity */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="p-6 bg-white rounded-lg shadow-lg w-96">
            <h2 className="mb-4 text-xl font-bold text-black">
              {isEditing ? "Edit Aktivitas" : "Tambah Aktivitas"}
            </h2>
            <form
              className="text-black"
              onSubmit={isEditing ? updateActivity : createActivity}
            >
              <div className="mb-4">
                <label className="block mb-2" htmlFor="title">
                  Judul Aktivitas
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2" htmlFor="description">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2" htmlFor="price">
                  Harga
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2" htmlFor="price_discount">
                  Harga Diskon
                </label>
                <input
                  type="number"
                  name="price_discount"
                  value={formData.price_discount}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2" htmlFor="category_id">
                  Kategori
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4 text-center">
                <img
                  src={formData.imageUrls[0]}
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

export default AdminActivity;
