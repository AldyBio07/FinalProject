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

const Navbar = ({ role = "user" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState("/");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 20);
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

  const currentNav = navigation[role] || navigation.user;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md shadow-lg" : "bg-white"
      }`}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text">
                TravelLog
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
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
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 transform hover:scale-105 group
                      ${
                        isActive
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                  >
                    <Icon
                      className={`w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-12
                      ${
                        isActive
                          ? "text-blue-600"
                          : "text-gray-400 group-hover:text-blue-600"
                      }`}
                    />
                    {item.name}
                  </a>
                );
              })}
              <button className="flex items-center px-4 py-2 text-sm font-medium text-red-600 transition-all duration-300 transform rounded-full hover:scale-105 hover:bg-red-50 group">
                <LogOut className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                Logout
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 text-gray-400 transition-colors duration-300 rounded-full hover:text-blue-600 hover:bg-blue-50 focus:outline-none"
            >
              {isOpen ? (
                <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
              ) : (
                <Menu className="w-6 h-6 transition-transform duration-300 hover:rotate-180" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out transform ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white/80 backdrop-blur-md">
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
                className={`flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 group
                  ${
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
              >
                <Icon
                  className={`w-5 h-5 mr-3 transition-transform duration-300 group-hover:rotate-12
                  ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-400 group-hover:text-blue-600"
                  }`}
                />
                {item.name}
              </a>
            );
          })}
          <button className="flex items-center w-full px-4 py-3 text-base font-medium text-red-600 transition-all duration-300 rounded-lg hover:bg-red-50 group">
            <LogOut className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:-translate-x-1" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
