import { useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { NotificationContainer, Notification } from "@/components/Notification";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      props: {
        activity: response.data.data || null,
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
  const [notifications, setNotifications] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Function to add notification
  const addNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeNotification(id), 5000);
  };

  // Function to remove notification
  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  // Function to safely render HTML content
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  // Function to save activity to cart
  const handleAddToCart = async () => {
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
      addNotification(`Added ${activity.title} to the cart!`);
    } catch (error) {
      addNotification("Failed to add item to cart", "error");
    }
  };

  if (!activity) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 text-center">
          <h1 className="mb-4 text-2xl font-bold">Activity not found</h1>
          <button
            onClick={() => router.push("/activities")}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Back to Activities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar />
      {/* Background Decorations */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 transform -translate-y-1/2 rounded-full w-96 h-96 bg-gradient-to-br from-blue-100/20 to-transparent blur-3xl translate-x-1/4" />
        <div className="absolute bottom-0 left-0 transform translate-y-1/2 rounded-full w-96 h-96 bg-gradient-to-tr from-blue-100/20 to-transparent blur-3xl -translate-x-1/4" />
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

      <div className="container px-4 py-8 mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center mb-6 text-gray-600 hover:text-gray-800"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="overflow-hidden bg-gray-100 rounded-2xl aspect-w-16 aspect-h-9">
              <img
                src={activity.imageUrls[currentImageIndex]}
                alt={activity.title}
                className="object-cover w-full h-full"
              />
            </div>
            {/* Thumbnail Grid */}
            <div className="grid grid-cols-4 gap-2">
              {activity.imageUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`overflow-hidden rounded-lg aspect-w-1 aspect-h-1 ${
                    currentImageIndex === index
                      ? "ring-2 ring-blue-500"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={url}
                    alt={`${activity.title} thumbnail ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Activity Details */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-block px-3 py-1 text-sm font-medium text-blue-600 rounded-full bg-blue-50">
                {activity.category?.name}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                {activity.title}
              </h1>
            </div>

            {/* Price Section */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-blue-600">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(activity.price_discount)}
                </span>
                {activity.price_discount < activity.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(activity.price)}
                    </span>
                    <span className="text-sm font-medium text-emerald-500">
                      {Math.round(
                        ((activity.price - activity.price_discount) /
                          activity.price) *
                          100
                      )}
                      % OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-blue max-w-none">
              <h2 className="text-xl font-semibold text-black">Description</h2>
              <p className="text-gray-600">{activity.description}</p>
            </div>

            {/* Facilities */}
            {activity.facilities && (
              <div className="prose prose-blue max-w-none">
                <h2 className="text-xl font-semibold text-black">Facilities</h2>
                <div
                  dangerouslySetInnerHTML={createMarkup(activity.facilities)}
                  className="text-gray-600"
                />
              </div>
            )}

            {/* Location Details */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-black">Location</h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Address:</span>{" "}
                  {activity.address}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">City:</span> {activity.city}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Province:</span>{" "}
                  {activity.province}
                </p>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full px-6 py-3 text-lg font-medium text-white transition-colors duration-200 bg-blue-600 rounded-xl hover:bg-blue-700"
            >
              Add to Cart
            </button>

            {/* Additional Details */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <h3 className="mb-3 text-lg font-semibold">Activity Details</h3>
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-gray-500">Rating</dt>
                  <dd className="text-gray-900">{activity.rating} / 5</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Total Reviews</dt>
                  <dd className="text-gray-900">{activity.total_reviews}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Category</dt>
                  <dd className="text-gray-900">{activity.category?.name}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Created</dt>
                  <dd className="text-gray-900">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Location Map */}
        {activity.location_maps && (
          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-bold text-black">Location Map</h2>
            <div className="overflow-hidden rounded-xl">
              <div
                dangerouslySetInnerHTML={createMarkup(activity.location_maps)}
                className="w-full aspect-video"
              />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ActivityDetail;
