import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { NotificationContainer, Notification } from "@/components/Notification";
import Router from "next/router";

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
    const response = await axios.get(
      "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities",
      {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      props: {
        activities: response.data.data || [],
        token, // Pass token to the component
      },
    };
  } catch (error) {
    console.error("Error fetching activities:", error);
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
}

const ActivityList = ({ activities = [], token }) => {
  const [filteredActivities, setFilteredActivities] = useState(activities);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);

  // Fetch cart data
  const fetchCartData = async () => {
    try {
      const response = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/carts",
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCart(response.data.data || []);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  // Extract categories from activities
  useEffect(() => {
    const uniqueCategories = [
      "All",
      ...new Set(activities.map((a) => a.category.name)),
    ];
    setCategories(uniqueCategories);
  }, [activities]);

  // Fetch cart data when the modal opens
  useEffect(() => {
    if (isModalOpen) {
      fetchCartData();
    }
  }, [isModalOpen]);

  // Filter activities by selected category
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredActivities(activities);
    } else {
      setFilteredActivities(
        activities.filter((activity) => activity.category.name === category)
      );
    }
  };

  // Function to save activity to cart via API
  const saveToCartAPI = async (activityId) => {
    try {
      await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/add-cart",
        { activityId },
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error saving to cart API:", error);
    }
  };

  const handleActivityClick = (activityId) => {
    router.push(`/activity/${activityId}`);
  };

  // Function to add notification
  const addNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  // Function to remove notification
  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  // Updated handleAddToCart function
  const handleAddToCart = async (activity) => {
    try {
      await saveToCartAPI(activity.id);
      setCart((prevCart) => {
        const itemInCart = prevCart.find((item) => item.id === activity.id);
        if (itemInCart) {
          return prevCart.map((item) =>
            item.id === activity.id
              ? { ...itemInCart, quantity: itemInCart.quantity + 1 }
              : item
          );
        }
        return [...prevCart, { ...activity, quantity: 1 }];
      });

      addNotification(`Added ${activity.title} to the cart!`);
    } catch (error) {
      addNotification("Failed to add item to cart", "error");
    }
  };

  // Paginated activities
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const Layout = ({ children, userRole }) => {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar role={userRole} />
        <main className="flex-grow pt-16">{children}</main>
        <Footer role={userRole} />
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar />
      {/* Background Decorations */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 transform -translate-y-1/2 rounded-full w-96 h-96 bg-gradient-to-br from-blue-100/20 to-transparent blur-3xl translate-x-1/4" />
        <div className="absolute bottom-0 left-0 transform translate-y-1/2 rounded-full w-96 h-96 bg-gradient-to-tr from-blue-100/20 to-transparent blur-3xl -translate-x-1/4" />
      </div>

      <Layout userRole="user">
        {/* Page Header & Search */}
        <div className="p-6 mb-8 bg-white shadow-xl rounded-2xl">
          <div className="max-w-4xl mx-auto">
            <h1 className="mb-6 text-3xl font-extrabold text-[#101827]">
              Activities
            </h1>
            <div className="flex items-center gap-4">
              {/* Category Filter Dropdown */}
              <select
                id="categoryFilter"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full py-3 pl-4 pr-10 text-[#101827] transition duration-200 border-2 border-gray-200 bg-gray-100 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <NotificationContainer>
          {notifications.map(({ id, message, type }) => (
            <Notification
              key={id}
              id={id}
              message={message}
              type={type}
              onClose={removeNotification}
            />
          ))}
        </NotificationContainer>

        {/* Activity Cards */}
        {paginatedActivities.length === 0 ? (
          <div className="p-8 text-center bg-white shadow-sm rounded-2xl">
            <p className="text-xl font-semibold text-gray-600">
              No activities found
            </p>
            <p className="mt-2 text-gray-500">
              Try selecting a different category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedActivities.map((activity) => (
              <div
                key={activity.id}
                onClick={() => handleActivityClick(activity.id)}
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

                  {/* Description */}
                  <p className="mb-4 text-sm text-black line-clamp-2">
                    {activity.description}
                  </p>

                  {/* Action Button */}
                  <div className="pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleAddToCart(activity)}
                      className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="sticky flex justify-center my-10 bottom-6">
            <div className="inline-flex bg-white divide-x divide-gray-200 shadow-sm rounded-xl">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 text-sm font-medium transition duration-200 
                    ${
                      currentPage === index + 1
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }
                    ${index === 0 ? "rounded-l-xl" : ""}
                    ${index === totalPages - 1 ? "rounded-r-xl" : ""}
                  `}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </Layout>
      <Footer />
    </div>
  );
};

export default ActivityList;
