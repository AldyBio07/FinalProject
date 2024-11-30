import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
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
import {
  HiSearch,
  HiOutlineX,
  HiUpload,
  HiClipboardList,
} from "react-icons/hi";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [filteredActivities, setFilteredActivities] = useState(activities);
  const itemsPerPage = 6;

  useEffect(() => {
    const filtered = activities.filter((activity) =>
      activity.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredActivities(filtered);
    setCurrentPage(1);
  }, [searchQuery, activities]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);
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
      showNotification("Failed to fetch activities", true);
    } finally {
      setLoading(false);
    }
  };

  const createActivity = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      resetForm();
      setIsModalOpen(false);
      fetchActivities();
      showNotification("Activity created successfully!");
    } catch (error) {
      showNotification("Failed to create activity", true);
    } finally {
      setLoading(false);
    }
  };

  const updateActivity = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      resetForm();
      setIsModalOpen(false);
      fetchActivities();
      showNotification("Activity updated successfully!");
    } catch (error) {
      showNotification("Failed to update activity", true);
    } finally {
      setLoading(false);
    }
  };

  const deleteActivity = async (activityId) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;
    setLoading(true);
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
      fetchActivities();
      showNotification("Activity deleted successfully!");
    } catch (error) {
      showNotification("Failed to delete activity", true);
    } finally {
      setLoading(false);
    }
  };

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
        imageUrls: [imageUrl],
      }));
    } catch (error) {
      showNotification("Failed to upload image", true);
    }
  };

  // Pagination calculations
  const indexOfLastActivity = currentPage * itemsPerPage;
  const indexOfFirstActivity = indexOfLastActivity - itemsPerPage;
  const currentActivities = filteredActivities.slice(
    indexOfFirstActivity,
    indexOfLastActivity
  );
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);

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
          <Navbar />
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
          <div className="p-6 mb-8 bg-white shadow-xl rounded-2xl">
            <div className="max-w-4xl mx-auto">
              <h1 className="mb-6 text-3xl font-extrabold text-[#101827]">
                Activity Management
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
                    placeholder="Search activities..."
                    className="w-full py-3 pl-12 pr-10 text-[#101827] transition duration-200 border-2 border-gray-200 bg-gray-100 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                <button
                  onClick={() => {
                    setIsEditing(false);
                    resetForm();
                    setIsModalOpen(true);
                  }}
                  className="flex items-center px-6 py-3 space-x-2 text-white transition duration-200 bg-[#101827] rounded-xl hover:bg-blue-700"
                >
                  <HiClipboardList className="w-5 h-5" />
                  <span>Add Activity</span>
                </button>
              </div>
            </div>
          </div>

          {/* Activities Grid */}
          {currentActivities.length === 0 ? (
            <div className="p-8 text-center bg-white shadow-sm rounded-2xl">
              <p className="text-xl font-semibold text-gray-600">
                No activities found
              </p>
              <p className="mt-2 text-gray-500">
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3">
              {currentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="relative overflow-hidden transition-all duration-300 bg-[#101827] hover:bg-[#D9E2E8] group rounded-2xl hover:shadow-lg"
                >
                  {/* Image Section */}
                  <div className="relative overflow-hidden h-96">
                    <img
                      src={activity.imageUrls[0]}
                      alt={activity.title}
                      className="object-cover w-full h-full transition-transform duration-500"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="p-5">
                    {/* Category Badge */}
                    <div className="mb-3">
                      <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 rounded-full bg-blue-50">
                        {activity.category?.name}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mb-2 text-lg font-bold text-[#FF6910] line-clamp-1">
                      {activity.title}
                    </h3>

                    {/* Price Section */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-bold text-blue-600">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(activity.price_discount)}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(activity.price)}
                      </span>
                      <div>
                        {activity.price_discount < activity.price && (
                          <span className="text-xs font-medium text-emerald-500">
                            {Math.round(
                              ((activity.price - activity.price_discount) /
                                activity.price) *
                                100
                            )}
                            % OFF
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mb-4 text-sm text-gray-500 line-clamp-2">
                      {activity.description}
                    </p>

                    {/* Action Buttons - Fixed Position */}
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => {
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
                        }}
                        className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                        title="Edit Activity"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteActivity(activity.id)}
                        className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100"
                        title="Delete Activity"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
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
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Pencil className="w-6 h-6 text-blue-500" />
                      <span>Edit Activity</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <PlusCircle className="w-6 h-6 text-blue-500" />
                      <span>Add New Activity</span>
                    </div>
                  )}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 transition-colors rounded-full hover:text-gray-600 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={isEditing ? updateActivity : createActivity}>
                <div className="p-6 space-y-6">
                  {/* Image Upload Section */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Activity Image
                    </label>
                    {formData.imageUrls[0] && (
                      <div className="relative overflow-hidden border-2 border-gray-100 rounded-lg aspect-video">
                        <img
                          src={formData.imageUrls[0]}
                          alt="Activity Preview"
                          className="object-cover w-full h-full"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, imageUrls: [""] })
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

                  {/* Activity Title */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-4 py-3 text-black transition-all border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      placeholder="Enter activity title"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 text-black transition-all border-2 border-gray-200 rounded-lg resize-none bg-gray-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      rows={4}
                      placeholder="Enter activity description"
                      required
                    />
                  </div>

                  {/* Price and Discount */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-black ">
                        Price
                      </label>
                      <div className="relative">
                        <span className="absolute text-black -translate-y-1/2 left-4 top-1/2">
                          $
                        </span>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                          className="py-3 pl-8 pr-4 text-black transition-all border-2 border-gray-200 rounded-lg text-blackw-full bg-gray-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Discounted Price
                      </label>
                      <div className="relative">
                        <span className="absolute text-gray-500 -translate-y-1/2 left-4 top-1/2">
                          $
                        </span>
                        <input
                          type="number"
                          name="price_discount"
                          value={formData.price_discount}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              price_discount: e.target.value,
                            })
                          }
                          className="w-full py-3 pl-8 pr-4 text-black transition-all border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category_id: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 text-black transition-all border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
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
                        <svg
                          className="w-4 h-4 animate-spin"
                          viewBox="0 0 24 24"
                        >
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
                        <span>{isEditing ? "Updating..." : "Creating..."}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Update Activity</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Create Activity</span>
                          </>
                        )}
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminActivity;
