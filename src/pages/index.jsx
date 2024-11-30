import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  HiMiniGlobeAmericas,
  HiMiniSparkles,
  HiMiniChatBubbleLeftRight,
} from "react-icons/hi2";
import {
  HiMapPin,
  HiCalendar,
  HiStar,
  HiTag,
  HiXMark,
  HiUserGroup,
  HiHeart,
} from "react-icons/hi2";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CustomAlert = ({ message, onClose }) => (
  <div className="fixed flex items-center gap-2 px-4 py-3 text-white bg-red-500 shadow-lg rounded-2xl bottom-4 right-4 animate-fade-in">
    <span>{message}</span>
    <button
      onClick={onClose}
      className="p-1 transition-colors rounded-full hover:bg-red-600"
    >
      <HiXMark className="w-4 h-4" />
    </button>
  </div>
);

const SkeletonCard = () => (
  <div className="overflow-hidden bg-white rounded-2xl animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="w-3/4 h-4 bg-gray-200 rounded-full" />
      <div className="w-1/2 h-4 bg-gray-200 rounded-full" />
    </div>
  </div>
);

const Home = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllPromotions, setShowAllPromotions] = useState(false);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [data, setData] = useState({
    banners: [],
    promotions: [],
    categories: [],
    activity: [],
  });

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });

    const fetchData = async () => {
      try {
        const headers = {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        };
        const baseUrl =
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1";

        const responses = await axios.all([
          axios.get(`${baseUrl}/banners`, { headers }),
          axios.get(`${baseUrl}/promos`, { headers }),
          axios.get(`${baseUrl}/categories`, { headers }),
          axios.get(`${baseUrl}/activities`, { headers }),
        ]);

        setData({
          banners: responses[0].data.data,
          promotions: responses[1].data.data,
          categories: responses[2].data.data,
          activity: responses[3].data.data,
        });
      } catch (error) {
        setErrorMessage("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#004CB8] to-[#0070F3]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/80" />
          {data.banners[0]?.imageUrl && (
            <img
              src={data.banners[0]?.imageUrl}
              alt="Travel background"
              className="object-cover w-full h-full opacity-40"
            />
          )}
          <div className="absolute inset-0">
            <div className="absolute w-64 h-64 rounded-full bg-white/10 blur-3xl -top-20 -left-20" />
            <div className="absolute w-64 h-64 rounded-full bg-blue-400/10 blur-3xl -bottom-20 -right-20" />
          </div>
        </div>

        <div className="relative px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-32">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="max-w-2xl" data-aos="fade-right">
              <div className="inline-flex items-center px-4 py-2 mb-6 space-x-2 text-sm text-white rounded-full bg-white/10 backdrop-blur-sm">
                <span className="animate-pulse">🌟</span>
                <span>Welcome to Travel Journey</span>
              </div>

              <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
                Discover the World's{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  Hidden Treasures
                </span>
              </h1>

              <p className="mb-8 text-lg text-white/80 sm:text-xl">
                Start your journey with us and explore breathtaking
                destinations. Exclusive deals and unforgettable experiences
                await you.
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 text-lg font-semibold text-white transition-all border-2 rounded-full border-white/20 hover:bg-white hover:text-blue-600 hover:border-white">
                  Start Your Adventure
                </button>
                <button className="px-8 py-4 text-lg font-semibold text-blue-900 transition-all bg-white rounded-full hover:bg-blue-50">
                  View Special Offers
                </button>
              </div>

              <div
                className="grid grid-cols-3 gap-8 mt-12"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="mt-1 text-sm text-white/60">Destinations</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">50K+</div>
                  <div className="mt-1 text-sm text-white/60">
                    Happy Travelers
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">4.9</div>
                  <div className="mt-1 text-sm text-white/60">User Rating</div>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block" data-aos="fade-left">
              <div className="grid grid-cols-2 gap-4">
                {data.activity.slice(0, 4).map((item, index) => (
                  <div
                    key={item.id}
                    className={`overflow-hidden rounded-2xl ${
                      index % 2 === 0 ? "translate-y-8" : ""
                    }`}
                    data-aos="zoom-in"
                    data-aos-delay={index * 100}
                  >
                    <div className="relative aspect-[4/5]">
                      <img
                        src={item.category.imageUrl}
                        alt={item.name}
                        className="object-cover w-full h-full transition-transform duration-700 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="text-lg font-semibold">
                          {item.title || item.name}
                        </h3>
                        <p className="text-sm text-white/80">
                          {item.category.name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute w-full h-full border-2 border-white/20 rounded-2xl -top-4 -right-4 -z-10" />
            </div>
          </div>
        </div>

        <div className="relative h-16 bg-gray-50">
          <svg
            className="absolute bottom-0 w-full h-16 text-gray-50"
            preserveAspectRatio="none"
            viewBox="0 0 1440 54"
            fill="currentColor"
          >
            <path d="M0 0L1440 48H0V0Z" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Popular Destinations */}
        <section className="mb-12">
          <h2
            className="mb-8 text-2xl font-bold text-gray-900"
            data-aos="fade-up"
          >
            Popular Destinations
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.activity
              .slice(0, showAllActivities ? undefined : 8)
              .map((item, index) => (
                <div
                  key={item.id}
                  className="overflow-hidden transition-all bg-white rounded-lg shadow-sm hover:shadow-md"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="relative">
                    <img
                      src={item.category.imageUrl}
                      alt={item.name}
                      className="object-cover w-full h-48"
                    />
                    <div className="absolute px-2 py-1 text-xs font-medium text-white bg-orange-500 rounded bottom-2 left-2">
                      Popular
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.title || item.name}
                    </h3>
                    <div className="flex items-center mt-2 space-x-2 text-sm">
                      <span className="px-2 py-1 text-green-700 bg-green-100 rounded">
                        Best Value
                      </span>
                      <div className="flex items-center text-orange-500">
                        <HiStar className="w-4 h-4" />
                        <span className="ml-1 font-medium">4.8</span>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      <p>From</p>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-2xl font-bold text-gray-900">
                          $150
                        </span>
                        <span className="text-gray-500">per night</span>
                      </div>
                    </div>
                    <button className="w-full px-4 py-2 mt-4 text-sm font-medium text-orange-500 transition-colors border border-orange-500 rounded-lg hover:bg-orange-50">
                      View Deals
                    </button>
                  </div>
                </div>
              ))}
          </div>
          {data.activity.length > 8 && (
            <div className="mt-12 text-center" data-aos="fade-up">
              <button
                onClick={() => setShowAllActivities(!showAllActivities)}
                className="px-8 py-3 font-medium text-gray-600 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {showAllActivities ? "Show Less" : "Show More Destinations"}
              </button>
            </div>
          )}
        </section>

        {/* Why Choose Us section */}
        <section
          className="py-16 mt-12 bg-gray-900 rounded-xl"
          data-aos="fade-up"
        >
          <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="text-center" data-aos="fade-down">
              <h2 className="mb-2 text-3xl font-bold text-white">
                Why Choose Us
              </h2>
              <p className="mb-12 text-gray-400">
                Experience the best in travel with our premium services
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  icon: HiMiniGlobeAmericas,
                  title: "Global Coverage",
                  description: "Access to thousands of destinations worldwide",
                },
                {
                  icon: HiMiniSparkles,
                  title: "Best Deals",
                  description: "Guaranteed lowest prices and exclusive offers",
                },
                {
                  icon: HiMiniChatBubbleLeftRight,
                  title: "24/7 Support",
                  description: "Expert assistance whenever you need it",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-6 text-center transition-transform bg-gray-800 rounded-lg hover:-translate-y-1"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <feature.icon className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                  <h3 className="mb-2 text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-12 text-center md:grid-cols-4">
              {[
                { value: "500K+", label: "Happy Travelers" },
                { value: "1000+", label: "Destinations" },
                { value: "98%", label: "Satisfaction Rate" },
                { value: "24/7", label: "Support Available" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-800 rounded-lg"
                  data-aos="zoom-in"
                  data-aos-delay={index * 100}
                >
                  <div className="text-3xl font-bold text-orange-500">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Special Offers */}
        <section className="py-12 bg-white rounded-lg" data-aos="fade-up">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">
            Special Offers
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.promotions
              .slice(0, showAllPromotions ? undefined : 3)
              .map((promo, index) => (
                <div
                  key={promo.id}
                  className="overflow-hidden transition-all border border-gray-200 rounded-lg hover:shadow-lg"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="relative">
                    <img
                      src={promo.imageUrl}
                      alt={promo.title}
                      className="object-cover w-full h-48"
                    />
                    <div className="absolute inline-flex items-center px-3 py-1 text-sm font-bold text-orange-500 bg-white rounded-full shadow-md top-4 right-4">
                      <HiTag className="w-4 h-4 mr-1" />
                      {promo.promo_discount_price}% OFF
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full">
                        Limited Time
                      </span>
                      <span className="text-xs text-gray-500">
                        Code: {promo.promo_code}
                      </span>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      {promo.title}
                    </h3>
                    <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                      {promo.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-500">
                        Valid until Dec 31, 2024
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {errorMessage && (
          <CustomAlert
            message={errorMessage}
            onClose={() => setErrorMessage(null)}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
