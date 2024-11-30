import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getCookie } from "cookies-next";
import { uploadImage } from "@/helper/uploadImage";
import { Pencil, X, Upload, Save } from "lucide-react";
import Navbar from "@/components/Navbar";

const Profile = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [updatedInfo, setUpdatedInfo] = useState({
    name: "",
    email: "",
    profilePictureUrl: "",
    phoneNumber: "",
  });

  // Fetch current user data
  const fetchUserData = async () => {
    const token = getCookie("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const response = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/user",
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = response.data.data;
      setUserInfo(userData);
      setUpdatedInfo({
        name: userData.name,
        email: userData.email,
        profilePictureUrl: userData.profilePictureUrl,
        phoneNumber: userData.phoneNumber || "",
      });
    } catch (error) {
      showNotification("Failed to fetch user data", true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

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
      setUpdatedInfo((prev) => ({
        ...prev,
        profilePictureUrl: imageUrl,
      }));
    } catch (error) {
      showNotification("Failed to upload image", true);
    }
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-profile",
        updatedInfo,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      showNotification("Profile updated successfully");
      fetchUserData(); // Refresh user data
    } catch (error) {
      showNotification("Failed to update profile", true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Background Decorations */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 transform -translate-y-1/2 rounded-full w-96 h-96 bg-gradient-to-br from-blue-100/20 to-transparent blur-3xl translate-x-1/4" />
        <div className="absolute bottom-0 left-0 transform translate-y-1/2 rounded-full w-96 h-96 bg-gradient-to-tr from-blue-100/20 to-transparent blur-3xl -translate-x-1/4" />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 ml-64">
        {/* Fixed Navbar */}
        <div className="fixed top-0 right-0 z-20 bg-white shadow-sm left-64">
          <Navbar role={userInfo?.role} />
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
          <div className="max-w-2xl p-6 mx-auto bg-white shadow-sm rounded-2xl">
            <h1 className="mb-6 text-3xl font-extrabold text-black">
              Profile Settings
            </h1>

            {/* Profile Form */}
            <div className="space-y-6">
              {/* Image Upload Section */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-black">
                    Profile picture
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    A picture helps people recognize you and lets you know when
                    you're signed in to your account
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  {/* Profile Picture Preview */}
                  {updatedInfo.profilePictureUrl ? (
                    <div className="relative">
                      <div className="w-40 h-40 overflow-hidden bg-gray-100 rounded-full">
                        <img
                          src={updatedInfo.profilePictureUrl}
                          alt="Profile Preview"
                          className="object-cover w-full h-full"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-4">
                        <label className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700">
                          <Upload className="w-4 h-4" />
                          <span>Change</span>
                          <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                          />
                        </label>
                        <button
                          onClick={() =>
                            setUpdatedInfo((prev) => ({
                              ...prev,
                              profilePictureUrl: "",
                            }))
                          }
                          className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-full hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Upload Section when no image
                    <div className="flex flex-col items-center">
                      <div className="w-40 h-40 mb-4 bg-gray-100 rounded-full">
                        <div className="flex items-center justify-center w-full h-full text-gray-400">
                          <Upload className="w-12 h-12" />
                        </div>
                      </div>
                      <label className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700">
                        <Upload className="w-4 h-4" />
                        <span>Upload photo</span>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* User Info Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Name</label>
                  <input
                    type="text"
                    value={updatedInfo.name}
                    onChange={(e) =>
                      setUpdatedInfo((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 text-black transition-all border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">
                    Email
                  </label>
                  <input
                    type="email"
                    value={updatedInfo.email}
                    onChange={(e) =>
                      setUpdatedInfo((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 text-black transition-all border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={updatedInfo.phoneNumber}
                    onChange={(e) =>
                      setUpdatedInfo((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 text-black transition-all border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleUpdateProfile}
                  disabled={saving}
                  className={`
                    px-6 py-3 text-sm font-medium text-white rounded-lg
                    transition-all focus:outline-none focus:ring-4 focus:ring-blue-100
                    ${
                      saving
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }
                  `}
                >
                  {saving ? (
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
                      <span>Saving Changes...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
