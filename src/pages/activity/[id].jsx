import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getCookie } from "cookies-next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Star, Users, Clock, Check } from "lucide-react";

// Server-side props to fetch activity data
export async function getServerSideProps({ params, req, res }) {
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
      `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activity/${params.id}`,
      {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        },
      }
    );

    // Check if we have valid data
    if (!response.data || !response.data.data) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        activity: response.data.data,
        token,
      },
    };
  } catch (error) {
    console.error("Error fetching activity:", error);
    return {
      notFound: true,
    };
  }
}

const ActivityDetail = ({ activity, token }) => {
  const router = useRouter();
  const [activity, setActivity] = useState(initialActivity);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/add-cart",
        { activityId: activity.id },
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showNotification("Added to cart successfully!");
    } catch (error) {
      showNotification("Failed to add to cart", true);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, isError = false) => {
    setNotification({
      message,
      type: isError ? "error" : "success",
    });
    setTimeout(() => setNotification(null), 3000);
  };

  if (!activity) {
    return <div>Loading...</div>;
  }

  // Add a loading state for when activity data isn't available yet
  if (router.isFallback || !activity) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="user" />

      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          } transition-all duration-300 transform`}
        >
          {notification.message}
        </div>
      )}

      <main className="container px-4 py-8 mx-auto mt-16">
        <div className="max-w-5xl mx-auto">
          {/* Image Gallery */}
          <div className="grid gap-4 mb-8 md:grid-cols-2">
            {activity.imageUrls.map((url, index) => (
              <div key={index} className="overflow-hidden rounded-2xl">
                <img
                  src={url || "/api/placeholder/600/400"}
                  alt={`${activity.title} - Image ${index + 1}`}
                  className="object-cover w-full h-64"
                />
              </div>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid gap-8 md:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 md:col-span-2">
              <div>
                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                  {activity.title}
                </h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {activity.city}, {activity.province}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    {activity.rating}/10
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {activity.total_reviews} reviews
                  </span>
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl">
                <h2 className="mb-4 text-xl font-semibold">
                  About This Activity
                </h2>
                <p className="text-gray-600">{activity.description}</p>
              </div>

              <div className="p-6 bg-white rounded-xl">
                <h2 className="mb-4 text-xl font-semibold">Facilities</h2>
                <div className="flex flex-wrap gap-2">
                  {activity.facilities.split(",").map((facility, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 rounded-full bg-blue-50"
                    >
                      <Check className="w-4 h-4" />
                      {facility.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl">
                <h2 className="mb-4 text-xl font-semibold">Location</h2>
                <p className="mb-4 text-gray-600">{activity.address}</p>
                <div className="w-full h-[300px] rounded-lg overflow-hidden">
                  <div
                    dangerouslySetInnerHTML={{ __html: activity.location_maps }}
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="sticky p-6 bg-white rounded-xl top-24">
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Regular price</span>
                    <span className="text-lg line-through">
                      Rp {activity.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Discount price</span>
                    <span className="text-2xl font-bold text-blue-600">
                      Rp {activity.price_discount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={loading}
                  className={`
                    w-full px-6 py-3 text-sm font-medium text-white transition-colors rounded-lg
                    ${
                      loading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }
                  `}
                >
                  {loading ? "Adding to Cart..." : "Add to Cart"}
                </button>

                <div className="mt-4 text-sm text-gray-500">
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Book now to secure your spot
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ActivityDetail;
