import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
import axios from "axios";
import { Button } from "flowbite-react";
import { HiMail, HiLockClosed, HiOutlineGlobeAlt } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [focusedInput, setFocusedInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/login",
        formData,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );

      setCookie("token", response.data.token);
      router.push("/");
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred during login"
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
            {/* Logo */}
            <div className="flex items-center space-x-1">
              <span className="text-[#0064D2] text-3xl font-black">travel</span>
              <span className="text-[#FF6B6B] text-3xl font-black">
                .journey
              </span>
            </div>
            {/* Language Selector */}
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
          {/* Left Side - Login Form */}
          <div className="w-full lg:w-1/2">
            <div className="p-8 bg-white shadow-lg rounded-3xl sm:p-12">
              <div className="max-w-md mx-auto">
                <div className="mb-10 text-center">
                  <h1 className="mb-3 text-3xl font-bold text-gray-900">
                    Welcome Back! 👋
                  </h1>
                  <p className="text-gray-600">
                    Please login to continue your journey
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
                        className="w-full px-4 py-3.5 rounded-2xl border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition duration-200"
                        placeholder={
                          focusedInput === "email" ? "Enter your email" : ""
                        }
                      />
                      <HiMail
                        className={`absolute right-4 top-4 w-5 h-5 ${
                          focusedInput === "email"
                            ? "text-blue-500"
                            : "text-gray-400"
                        }`}
                      />
                    </div>

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
                        className="w-full px-4 py-3.5 rounded-2xl border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition duration-200"
                        placeholder={
                          focusedInput === "password"
                            ? "Enter your password"
                            : ""
                        }
                      />
                      <HiLockClosed
                        className={`absolute right-4 top-4 w-5 h-5 ${
                          focusedInput === "password"
                            ? "text-blue-500"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative">
                        <input
                          id="remember"
                          type="checkbox"
                          className="w-5 h-5 text-blue-600 transition duration-200 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                      <label
                        htmlFor="remember"
                        className="ml-2 text-sm text-gray-600 select-none"
                      >
                        Remember me
                      </label>
                    </div>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-blue-600 transition duration-200 hover:text-blue-700"
                    >
                      Forgot password?
                    </Link>
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
                        <span className="ml-2">Signing in...</span>
                      </div>
                    ) : (
                      "Sign in"
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

                  {/* Social Login Buttons */}
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
                    Don't have an account?{" "}
                    <Link
                      href="/auth/register"
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      Sign up now
                    </Link>
                  </p>
                </form>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                {
                  icon: "🔒",
                  title: "Secure Login",
                  desc: "256-bit SSL encryption",
                },
                {
                  icon: "⚡",
                  title: "Quick Book",
                  desc: "Book in just 2 minutes",
                },
                {
                  icon: "💎",
                  title: "Best Prices",
                  desc: "Price match guarantee",
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
                Special Offers 🎉
              </h2>

              {/* Promo Cards */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6 transform transition duration-300 hover:scale-[1.02] cursor-pointer">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-16 h-16 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl">
                        <span className="text-xl font-bold text-white">
                          25%
                        </span>
                      </div>
                    </div>
                    <div className="ml-6">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          First Booking Discount
                        </h3>
                        <span className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                          New User
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600">
                        Get 25% off on your first booking! Valid for all
                        destinations.
                      </p>
                      <div className="flex items-center mt-3 text-sm text-blue-600">
                        <span className="font-medium">Use code: </span>
                        <code className="px-3 py-1 ml-2 font-mono rounded-lg bg-blue-50">
                          FIRST25
                        </code>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 transform transition duration-300 hover:scale-[1.02] cursor-pointer">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-16 h-16 shadow-lg bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl">
                        <span className="text-xl font-bold text-white">
                          15%
                        </span>
                      </div>
                    </div>
                    <div className="ml-6">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          Weekend Special
                        </h3>
                        <span className="px-3 py-1 text-xs font-medium text-orange-600 bg-orange-100 rounded-full">
                          Limited
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600">
                        Book your weekend getaway and save 15% on hotels!
                      </p>
                      <div className="flex items-center mt-3 text-sm text-orange-600">
                        <span className="font-medium">Valid until: </span>
                        <span className="px-3 py-1 ml-2 rounded-lg bg-orange-50">
                          Dec 31, 2024
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download App Section */}
              <div className="p-6 mt-8 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl">
                <div className="flex justify-between items -center">
                  <div>
                    <h3 className="mb-2 text-xl font-bold">Download Our App</h3>
                    <p className="mb-4 text-sm opacity-80">
                      Get exclusive deals and manage your trips on the go
                    </p>
                    <div className="flex space-x-3">
                      <button className="flex items-center px-4 py-2 space-x-2 text-blue-600 transition bg-white rounded-lg hover:bg-gray-100">
                        <img
                          src="/apple-store-logo.svg"
                          alt="App Store"
                          className="w-5 h-5"
                        />
                        <span className="text-sm font-medium">App Store</span>
                      </button>
                      <button className="flex items-center px-4 py-2 space-x-2 text-blue-600 transition bg-white rounded-lg hover:bg-gray-100">
                        <img
                          src="/google-play-logo.svg"
                          alt="Google Play"
                          className="w-5 h-5"
                        />
                        <span className="text-sm font-medium">Google Play</span>
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <img
                      src="/mobile-app-mockup.png"
                      alt="Mobile App"
                      className="w-32 h-auto transition-transform duration-300 transform rotate-12 hover:rotate-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
