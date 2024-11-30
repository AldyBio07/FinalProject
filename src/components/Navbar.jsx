import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  User,
  LogOut,
  Home,
  Activity,
  Gift,
  LayoutDashboard,
  ChevronDown,
  ShoppingCart,
  FileText,
} from "lucide-react";
import { deleteCookie, getCookie } from "cookies-next";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState("/");
  const [userData, setUserData] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    if (
      mounted &&
      userData &&
      (window.location.pathname === "/transaction/cart" ||
        window.location.pathname === "/transaction/my-transaction") &&
      userData.role !== "user"
    ) {
      window.location.href = "/auth/login";
    }
    setActiveItem(window.location.pathname);
  }, [mounted, userData]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          return;
        }

        const response = await fetch(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/user",
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        if (result.code === "200") {
          setUserData(result.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    setMounted(true);
    fetchUserData();
  }, [mounted]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    if (mounted) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [mounted]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest(".profile-dropdown")) {
        setIsProfileOpen(false);
      }
    };

    if (mounted) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isProfileOpen, mounted]);

  const handleNavigation = (href) => {
    setActiveItem(href);
    if (mounted) {
      window.location.href = href;
    }
  };

  const handleLogout = () => {
    if (mounted) {
      deleteCookie("token");
      window.location.href = "/auth/login";
    }
  };

  const getNavigationItems = () => {
    const defaultNav = [
      { name: "Home", href: "/" },
      { name: "Activity", href: "/activity" },
      { name: "Promo", href: "/promo" },
    ];

    if (!userData) return defaultNav;

    const userRole = userData.role;

    switch (userRole) {
      case "user":
        return [
          ...defaultNav,
          { name: "Cart", href: "/transaction/cart", icon: ShoppingCart },
          {
            name: "My Transaction",
            href: "/transaction/my-transaction",
            icon: FileText,
          },
        ];
      case "admin":
        return [
          ...defaultNav,
          {
            name: "Dashboard",
            href: "/dashboard/activity",
            icon: LayoutDashboard,
          },
        ];
      default:
        return defaultNav;
    }
  };

  const navigation = getNavigationItems();

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-lg" : "bg-[#FF690F]"
      }`}
    >
      <div className="h-16 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          {/* Logo with enhanced typography */}
          <div
            className="flex items-center space-x-1 cursor-pointer"
            onClick={() => handleNavigation("/")}
          >
            <span
              className={`text-2xl font-extrabold tracking-tight ${
                scrolled ? "text-[#FF690F]" : "text-white"
              }`}
            >
              travel
            </span>
            <span
              className={`text-2xl font-extrabold tracking-tight ${
                scrolled ? "text-[#FF690F]" : "text-white"
              }`}
            >
              .journey
            </span>
          </div>

          {/* Desktop Navigation with improved typography */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <nav className="flex items-center space-x-6">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`text-sm tracking-wide transition-all duration-200 cursor-pointer ${
                    activeItem === item.href
                      ? scrolled
                        ? "text-[#FF690F] font-semibold"
                        : "text-white font-semibold"
                      : scrolled
                      ? "text-gray-600 hover:text-[#FF690F] font-medium"
                      : "text-white/90 hover:text-white font-medium"
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* User Profile & Dropdown with enhanced typography */}
            {userData ? (
              <div className="relative ml-6 profile-dropdown">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-8 h-8 overflow-hidden border-2 border-white rounded-full">
                    <img
                      src={
                        userData.profilePictureUrl || "/api/placeholder/32/32"
                      }
                      alt={userData.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <span
                    className={`text-sm font-semibold tracking-wide ${
                      scrolled ? "text-gray-700" : "text-white"
                    }`}
                  >
                    {userData.name}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 ${
                      scrolled ? "text-gray-400" : "text-white"
                    }`}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 w-48 mt-2 overflow-hidden bg-white rounded-lg shadow-lg">
                    <div className="py-1">
                      <a
                        onClick={() => handleNavigation("/profile")}
                        className="flex items-center px-4 py-2 text-sm font-medium tracking-wide text-gray-700 cursor-pointer hover:bg-orange-50"
                      >
                        <User className="w-4 h-4 mr-2 text-[#FF690F]" />
                        Profile
                      </a>
                      <a
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 text-sm font-medium tracking-wide text-gray-700 cursor-pointer hover:bg-orange-50"
                      >
                        <LogOut className="w-4 h-4 mr-2 text-[#FF690F]" />
                        Logout
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center ml-6 space-x-4">
                <a
                  onClick={() => handleNavigation("/auth/login")}
                  className={`px-4 py-2 text-sm font-semibold tracking-wide transition-colors ${
                    scrolled
                      ? "text-[#FF690F] hover:text-[#FF690F]/80"
                      : "text-white hover:text-white/80"
                  } cursor-pointer`}
                >
                  Login
                </a>
                <a
                  onClick={() => handleNavigation("/auth/register")}
                  className={`px-4 py-2 text-sm font-semibold tracking-wide rounded-full cursor-pointer ${
                    scrolled
                      ? "bg-[#FF690F] text-white hover:bg-[#FF690F]/90"
                      : "bg-white text-[#FF690F] hover:bg-white/90"
                  }`}
                >
                  Register
                </a>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            {userData && (
              <div className="w-8 h-8 mr-3 overflow-hidden border-2 border-white rounded-full">
                <img
                  src={userData.profilePictureUrl || "/api/placeholder/32/32"}
                  alt={userData.name}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg ${
                scrolled
                  ? "text-gray-400 hover:text-[#FF690F] hover:bg-orange-50"
                  : "text-white hover:text-white hover:bg-[#FF690F]/80"
              }`}
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

      {/* Mobile Menu Dropdown with improved typography */}
      {isOpen && (
        <div className="absolute left-0 right-0 bg-white border-b md:hidden">
          <div className="px-4 py-3 space-y-1">
            {userData && (
              <div className="px-4 py-2 mb-2 text-sm font-semibold tracking-wide text-gray-700 border-b">
                {userData.name}
              </div>
            )}
            {navigation.map((item) => (
              <a
                key={item.name}
                onClick={() => {
                  handleNavigation(item.href);
                  setIsOpen(false);
                }}
                className={`flex items-center px-4 py-3 text-sm tracking-wide rounded-lg cursor-pointer ${
                  activeItem === item.href
                    ? "text-[#FF690F] bg-orange-50 font-semibold"
                    : "text-gray-600 hover:text-[#FF690F] hover:bg-orange-50 font-medium"
                }`}
              >
                {item.icon && <item.icon className="w-5 h-5 mr-3" />}
                {item.name}
              </a>
            ))}
            {!userData ? (
              <div className="pt-2 border-t">
                <a
                  onClick={() => handleNavigation("/auth/login")}
                  className="flex items-center px-4 py-3 text-sm font-semibold tracking-wide text-[#FF690F] hover:bg-orange-50 rounded-lg cursor-pointer"
                >
                  Login
                </a>
                <a
                  onClick={() => handleNavigation("/auth/register")}
                  className="flex items-center px-4 py-3 text-sm font-semibold tracking-wide text-white bg-[#FF690F] hover:bg-[#FF690F]/90 rounded-lg mt-2 cursor-pointer"
                >
                  Register
                </a>
              </div>
            ) : (
              <div className="pt-2 border-t">
                <a
                  onClick={() => handleNavigation("/profile")}
                  className="flex items-center px-4 py-3 text-sm font-medium tracking-wide text-gray-600 hover:text-[#FF690F] hover:bg-orange-50 rounded-lg cursor-pointer"
                >
                  <User className="w-5 h-5 mr-3" />
                  Profile
                </a>
                <a
                  onClick={handleLogout}
                  className="flex items-center px-4 py-3 text-sm font-medium tracking-wide text-gray-600 hover:text-[#FF690F] hover:bg-orange-50 rounded-lg cursor-pointer"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
