import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
import axios from "axios";
import {
  HiMail,
  HiLockClosed,
  HiOutlineGlobeAlt,
  HiPhone,
  HiUser,
} from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Upload, X } from "lucide-react";
import { uploadImage } from "@/helper/uploadImage";

const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    passwordRepeat: "",
    role: "",
    profilePictureUrl: "",
  });
  const [focusedInput, setFocusedInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        profilePictureUrl: imageUrl,
      }));
    } catch (error) {
      setError("Failed to upload image");
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      setError("Phone number is required");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password !== formData.passwordRepeat) {
      setError("Passwords do not match");
      return false;
    }
    if (!formData.profilePictureUrl) {
      setError("Profile picture is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/register",
        formData,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );

      setCookie("token", response.data.token);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred during registration"
      );
    } finally {
      setLoading(false);
    }
  };

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
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-12 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <div className="p-8 bg-white shadow-lg rounded-3xl sm:p-12">
              <div className="max-w-md mx-auto">
                <div className="mb-10 text-center">
                  <h1 className="mb-3 text-3xl font-bold text-gray-900">
                    Create Account ✨
                  </h1>
                  <p className="text-gray-600">
                    Join us and start your journey today
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 border border-red-100 bg-red-50 rounded-2xl">
                      <p className="flex items-center text-sm text-red-600">
                        <span className="mr-2">⚠️</span>
                        {error}
                      </p>
                    </div>
                  )}

                  <div className="space-y-5">
                    {/* Name Input */}
                    <div className="relative">
                      <label
                        htmlFor="name"
                        className={`absolute left-3 ${
                          focusedInput === "name" || formData.name
                            ? "-top-2.5 text-sm bg-white px-2 text-blue-600"
                            : "top-3.5 text-gray-400"
                        } transition-all duration-200`}
                      >
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedInput("name")}
                        onBlur={() => setFocusedInput("")}
                        className="text-black w-full px-4 py-3.5 rounded-2xl border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition duration-200"
                      />
                      <HiUser
                        className={`absolute right-4 top-4 w-5 h-5 ${
                          focusedInput === "name"
                            ? "text-blue-500"
                            : "text-gray-400"
                        }`}
                      />
                    </div>

                    {/* Email Input */}
                    <div className="relative">
                      <label
                        htmlFor="email"
                        className={`absolute left-3 ${
                          focusedInput === "email" || formData.email
                            ? "-top-2.5 text-sm bg-white px-2 text-blue-600"
                            : "top-3.5 text-gray-400"
                        } transition-all duration-200`}
                      >
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedInput("email")}
                        onBlur={() => setFocusedInput("")}
                        className="text-black w-full px-4 py-3.5 rounded-2xl border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition duration-200"
                      />
                      <HiMail
                        className={`absolute right-4 top-4 w-5 h-5 ${
                          focusedInput === "email"
                            ? "text-blue-500"
                            : "text-gray-400"
                        }`}
                      />
                    </div>

                    {/* Phone Number Input */}
                    <div className="relative">
                      <label
                        htmlFor="phoneNumber"
                        className={`absolute left-3 ${
                          focusedInput === "phoneNumber" || formData.phoneNumber
                            ? "-top-2.5 text-sm bg-white px-2 text-blue-600"
                            : "top-3.5 text-gray-400"
                        } transition-all duration-200`}
                      >
                        Phone Number
                      </label>
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        required
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        onFocus={() => setFocusedInput("phoneNumber")}
                        onBlur={() => setFocusedInput("")}
                        className="text-black w-full px-4 py-3.5 rounded-2xl border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition duration-200"
                      />
                      <HiPhone
                        className={`absolute right-4 top-4 w-5 h-5 ${
                          focusedInput === "phoneNumber"
                            ? "text-blue-500"
                            : "text-gray-400"
                        }`}
                      />
                    </div>

                    {/* Role Selection */}
                    <div className="relative">
                      <label
                        htmlFor="role"
                        className="absolute -top-2.5 left-3 text-sm bg-white px-2 text-blue-600"
                      >
                        Role
                      </label>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="text-black w-full px-4 py-3.5 rounded-2xl border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition duration-200"
                      >
                        <option value="">Select a role</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    {/* Profile Picture Upload */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-blue-600">
                        Profile Picture
                      </label>
                      {formData.profilePictureUrl && (
                        <div className="relative overflow-hidden border-2 border-gray-100 rounded-lg aspect-video">
                          <img
                            src={formData.profilePictureUrl}
                            alt="Profile Preview"
                            className="object-cover w-full h-full"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
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

                    {/* Password Input */}
                    <div className="relative">
                      <label
                        htmlFor="password"
                        className={`absolute left-3 ${
                          focusedInput === "password" || formData.password
                            ? "-top-2.5 text-sm bg-white px-2 text-blue-600"
                            : "top-3.5 text-gray-400"
                        } transition-all duration-200`}
                      >
                        Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => setFocusedInput("password")}
                        onBlur={() => setFocusedInput("")}
                        className="text-black w-full px-4 py-3.5 rounded-2xl border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition duration-200"
                      />
                      <HiLockClosed
                        className={`absolute right-4 top-4 w-5 h-5 ${
                          focusedInput === "password"
                            ? "text-blue-500"
                            : "text-gray-400"
                        }`}
                      />
                    </div>

                    {/* Repeat Password Input */}
                    <div className="relative">
                      <label
                        htmlFor="passwordRepeat"
                        className={`absolute left-3 ${
                          focusedInput === "passwordRepeat" ||
                          formData.passwordRepeat
                            ? "-top-2.5 text-sm bg-white px-2 text-blue-600"
                            : "top-3.5 text-gray-400"
                        } transition-all duration-200`}
                      >
                        Repeat Password
                      </label>
                      <input
                        id="passwordRepeat"
                        name="passwordRepeat"
                        type="password"
                        required
                        value={formData.passwordRepeat}
                        onChange={handleChange}
                        onFocus={() => setFocusedInput("passwordRepeat")}
                        onBlur={() => setFocusedInput("")}
                        className="text-black w-full px-4 py-3.5 rounded-2xl border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition duration-200"
                      />
                      <HiLockClosed
                        className={`absolute right-4 top-4 w-5 h-5 ${
                          focusedInput === "passwordRepeat"
                            ? "text-blue-500"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="relative">
                      <input
                        id="terms"
                        type="checkbox"
                        required
                        className="w-5 h-5 text-blue-600 transition duration-200 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <label
                      htmlFor="terms"
                      className="ml-2 text-sm text-gray-600 select-none"
                    >
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="font-medium text-blue-600 hover:text-blue-700"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="font-medium text-blue-600 hover:text-blue-700"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 px-6 rounded-2xl text-white font-medium
                      ${
                        loading
                          ? "bg-blue-400"
                          : "bg-blue-600 hover:bg-blue-700 active:transform active:scale-[0.99]"
                      } 
                      transition-all duration-200 shadow-lg shadow-blue-200`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-white rounded-full border-3 border-t-transparent animate-spin" />
                        <span className="ml-2">Creating account...</span>
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </button>

                  <div className="relative py-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-4 text-sm text-gray-500 bg-white">
                        or continue with
                      </span>
                    </div>
                  </div>

                  {/* Social Register Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      className="flex items-center justify-center px-6 py-3.5 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition duration-200"
                    >
                      <FcGoogle className="w-5 h-5" />
                      <span className="ml-2 font-medium text-gray-600">
                        Google
                      </span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center px-6 py-3.5 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition duration-200"
                    >
                      <FaFacebook className="w-5 h-5 text-[#1877F2]" />
                      <span className="ml-2 font-medium text-gray-600">
                        Facebook
                      </span>
                    </button>
                  </div>

                  <p className="text-center text-gray-600">
                    Already have an account?{" "}
                    <Link
                      href="/auth/login"
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      Sign in here
                    </Link>
                  </p>
                </form>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                {
                  icon: "🛡️",
                  title: "Secure SignUp",
                  desc: "Your data is protected",
                },
                {
                  icon: "✨",
                  title: "Easy Setup",
                  desc: "Ready in 2 minutes",
                },
                {
                  icon: "🎁",
                  title: "Welcome Gift",
                  desc: "Get 25% off first book",
                },
              ].map((badge, idx) => (
                <div key={idx} className="p-4 text-center bg-white rounded-2xl">
                  <div className="mb-2 text-2xl">{badge.icon}</div>
                  <h3 className="font-medium text-gray-900">{badge.title}</h3>
                  <p className="text-sm text-gray-500">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Promotional Content */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-24">
            <div className="p-8 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl sm:p-12">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Member Benefits 🌟
              </h2>

              {/* Benefits Cards */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6 transform transition duration-300 hover:scale-[1.02] cursor-pointer">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-16 h-16 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl">
                        <span className="text-xl text-white">🎯</span>
                      </div>
                    </div>
                    <div className="ml-6">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          Exclusive Member Deals
                        </h3>
                        <span className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                          Members Only
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600">
                        Access exclusive deals and save up to 40% on premium
                        bookings
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 transform transition duration-300 hover:scale-[1.02] cursor-pointer">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-16 h-16 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl">
                        <span className="text-xl text-white">🌍</span>
                      </div>
                    </div>
                    <div className="ml-6">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          Global Travel Network
                        </h3>
                        <span className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                          Worldwide
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600">
                        Connect with travelers worldwide and share experiences
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 transform transition duration-300 hover:scale-[1.02] cursor-pointer">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-16 h-16 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl">
                        <span className="text-xl text-white">💼</span>
                      </div>
                    </div>
                    <div className="ml-6">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          24/7 Support
                        </h3>
                        <span className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                          Premium
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600">
                        Get instant support from our travel experts anytime,
                        anywhere
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 bg-white shadow-inner">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <p className="text-gray-600">
            &copy; {new Date().getFullYear()} Travel Journey. All rights
            reserved.
          </p>
          <div className="flex justify-center mt-4 space-x-4">
            <Link
              href="/privacy"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Register;
