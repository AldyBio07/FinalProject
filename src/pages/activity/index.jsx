import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  // Add to cart handler
  const handleAddToCart = (activity) => {
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

    // Save to API
    saveToCartAPI(activity.id);

    // Show notification for a few seconds
    setNotification(`Added ${activity.title} to the cart!`);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Open/Close Modal

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
    <div className="min-h-screen p-6 text-gray-900 bg-gray-100">
      <Layout userRole="user">
        <h1 className="mb-4 text-3xl font-extrabold text-center text-blue-600">
          Activity List
        </h1>

        {/* Category Filter Dropdown */}
        <div className="mb-6">
          <label htmlFor="categoryFilter" className="mr-2 font-medium">
            Filter by Category:
          </label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="p-2 text-gray-700 bg-white border rounded-lg"
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Notification */}
        {notification && (
          <div className="fixed top-0 right-0 p-3 m-4 text-white bg-green-500 rounded-lg shadow-lg">
            {notification}
          </div>
        )}

        {/* Activity Cards */}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {paginatedActivities.map((activity) => (
            <div
              key={activity.id}
              className="overflow-hidden transition duration-300 transform bg-white rounded-lg shadow-lg hover:scale-105 hover:shadow-xl"
            >
              <img
                src={activity.imageUrls[0]}
                alt={activity.title}
                className="object-cover w-full h-48 rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800">
                  {activity.title}
                </h3>
                <h3 className="text-sm text-gray-600">
                  {activity.price_discount}
                </h3>
                <p className="text-sm text-gray-600">{activity.price}</p>
                <p className="mt-2 text-sm text-gray-600">
                  {typeof activity.description === "string"
                    ? activity.description
                    : JSON.stringify(activity.description)}
                </p>
                <button
                  onClick={() => handleAddToCart(activity)}
                  className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-6">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 mx-1 font-semibold text-white rounded ${
                currentPage === index + 1 ? "bg-blue-500" : "bg-gray-500"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </Layout>
    </div>
  );
};

export default ActivityList;
