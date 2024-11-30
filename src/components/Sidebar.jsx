import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/router";
import Link from "next/link";

const ActivityIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 transition-colors duration-300"
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
    className="w-5 h-5 transition-colors duration-300"
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
    className="w-5 h-5 transition-colors duration-300"
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
    className="w-5 h-5 transition-colors duration-300"
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
    className="w-5 h-5 transition-colors duration-300"
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

const Sidebar = ({ role }) => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const navigation = {
    user: [
      { name: "Activity", href: "/dashboard/activity", icon: ActivityIcon },
      { name: "Banner", href: "/dashboard/banner", icon: BannerIcon },
      { name: "Promo", href: "/dashboard/promo", icon: PromoIcon },
      {
        name: "Transactions",
        href: "/dashboard/transaction",
        icon: TransactionsIcon,
      },
      { name: "Users", href: "/dashboard/userlist", icon: UsersIcon },
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
      className={`
      fixed top-16 left-0 bottom-0 z-40
      bg-[#ffffff]
      transition-all duration-300 ease-in-out
      ${isOpen ? "w-64" : "w-16"}
    `}
    >
      <div
        className={`
        flex items-center justify-between
        px-4 py-3
        bg-[#141C2B]
        text-[#FF6910]
        transition-all duration-300
        ${isOpen ? "flex" : "justify-center"}
      `}
      >
        {isOpen && (
          <h3 className="text-lg font-semibold tracking-wide text-white">
            Dashboard
          </h3>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg hover:bg-[#141C2B]/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          {isOpen ? (
            <ChevronLeft className="w-5 h-5 text-gray-100" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-100" />
          )}
        </button>
      </div>

      <nav className="flex flex-col p-2 space-y-1">
        {currentNav.map((item) => {
          const Icon = item.icon;
          const isActive = router.pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center px-3 py-2.5 rounded-lg
                transition-all duration-200 group
                ${isOpen ? "justify-start" : "justify-center"}
                ${
                  isActive
                    ? "bg-[#FF6910]/20 text-white"
                    : "text-gray-300 hover:bg-[#FF6910]/20 hover:[#FF6910]/20"
                }
              `}
            >
              <div
                className={`
                flex items-center
                ${
                  isActive
                    ? "text-black"
                    : "text-[#FF6910] group-hover:text-black"
                }
                ${!isOpen && "justify-center w-full"}
              `}
              >
                <Icon />
                {isOpen && (
                  <span className="ml-3 text-sm font-medium tracking-wide">
                    {item.name}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
