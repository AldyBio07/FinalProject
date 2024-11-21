import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Home,
  Users,
  BookOpen,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState("/");
  const [userData, setUserData] = useState(null);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/user",
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.code === "200") {
          setUserData(data.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = {
    user: [
      { name: "Home", href: "/", icon: Home },
      { name: "My Profile", href: "/profile", icon: User },
      { name: "Travel Journal", href: "/journal", icon: BookOpen },
    ],
    admin: [
      { name: "Dashboard", href: "/admin", icon: Home },
      { name: "User Management", href: "/users", icon: Users },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  };

  const currentNav = userData
    ? navigation[userData.role] || navigation.user
    : navigation.user;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-lg" : "bg-white"
      }`}
    >
      <div className="h-16 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center space-x-1">
            <span className="text-[#0064D2] text-2xl font-black">travel</span>
            <span className="text-[#FF6B6B] text-2xl font-black">.journey</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* Navigation Items */}
            <nav className="flex items-center space-x-2">
              {currentNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.href;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveItem(item.href);
                    }}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 mr-2 ${
                        isActive ? "text-blue-600" : "text-gray-400"
                      }`}
                    />
                    {item.name}
                  </a>
                );
              })}
            </nav>

            {/* User Profile & Logout */}
            <div className="flex items-center pl-4 space-x-4 border-l border-gray-200">
              {userData && (
                <div className="flex items-center">
                  <div className="w-8 h-8 overflow-hidden rounded-full ring-2 ring-blue-500 ring-offset-2">
                    <img
                      src={
                        userData.profilePictureUrl || "/api/placeholder/32/32"
                      }
                      alt={userData.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {userData.name}
                  </span>
                </div>
              )}

              <button className="flex items-center px-4 py-2 text-sm font-medium text-red-600 rounded-full hover:bg-red-50">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            {userData && (
              <div className="w-8 h-8 mr-3 overflow-hidden rounded-full ring-2 ring-blue-500 ring-offset-2">
                <img
                  src={userData.profilePictureUrl || "/api/placeholder/32/32"}
                  alt={userData.name}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-400 rounded-full hover:text-blue-600 hover:bg-blue-50"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 bg-white border-b md:hidden">
          <div className="px-4 py-3 space-y-1">
            {userData && (
              <div className="px-4 py-2 mb-2 text-sm font-medium text-gray-700 border-b">
                {userData.name}
              </div>
            )}
            {currentNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveItem(item.href);
                    setIsOpen(false);
                  }}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 mr-3 ${
                      isActive ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                  {item.name}
                </a>
              );
            })}
            <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50">
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
