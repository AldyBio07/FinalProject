import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
const ActivityIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 mr-3 text-gray-400 transition-colors duration-300 group-hover:text-blue-600"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const BannerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 mr-3 text-gray-400 transition-colors duration-300 group-hover:text-blue-600"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 5v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2 -2V7a2 2 0 0 0 -2 -2H4a2 2 0 0 0 -2 2zm6 0v14" />
  </svg>
);

const PromoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 mr-3 text-gray-400 transition-colors duration-300 group-hover:text-blue-600"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 6h3a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-3" />
    <line x1="9" y1="15" x2="15" y2="9" />
  </svg>
);

const TransactionsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 mr-3 text-gray-400 transition-colors duration-300 group-hover:text-blue-600"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 mr-3 text-gray-400 transition-colors duration-300 group-hover:text-blue-600"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0 -4 -4h-4a4 4 0 0 0 -4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0 -3 -3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const Sidebar = ({ role = "user" }) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigation = {
    user: [
      { name: "Activity", href: "/activity", icon: ActivityIcon },
      { name: "Banner", href: "/banner", icon: BannerIcon },
      { name: "Promo", href: "/promo", icon: PromoIcon },
      { name: "Transactions", href: "/transactions", icon: TransactionsIcon },
      { name: "Users", href: "/users", icon: UsersIcon },
    ],
    admin: [
      { name: "Activity", href: "/dashboard/activity", icon: ActivityIcon },
      { name: "Banner", href: "/dashboard/banner", icon: BannerIcon },
      { name: "Promo", href: "/dashboard/promo", icon: PromoIcon },
      {
        name: "Transactions",
        href: "/dashboard/transaction",
        icon: TransactionsIcon,
      },
      { name: "User Management", href: "/dashboard/userlist", icon: UsersIcon },
    ],
  };

  const currentNav = navigation[role] || navigation.user;

  return (
    <div
      className={`fixed top-16 left-0 bottom-0 z-40 bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <div
        className={`flex items-center justify-between px-4 py-3 bg-blue-600 text-white transition-all duration-300 ${
          isOpen ? "flex" : "justify-center"
        }`}
      >
        {isOpen ? (
          <h3 className="text-lg font-semibold">Dashboard</h3>
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-white transition-colors duration-300 rounded-full hover:bg-blue-500 focus:outline-none"
        >
          {isOpen ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>
      <nav className="flex flex-col">
        {currentNav.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-gray-600 transition-colors duration-300 hover:bg-blue-50 hover:text-blue-600 ${
                isOpen ? "justify-start" : "justify-center"
              }`}
            >
              <Icon />
              {isOpen && (
                <span className="text-base font-medium text-gray-700">
                  {item.name}
                </span>
              )}
            </a>
          );
        })}
      </nav>
    </div>
  );
};
export default Sidebar;
