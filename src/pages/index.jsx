import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { HiOutlineGlobeAlt, HiChevronRight } from "react-icons/hi";
import { HiMapPin, HiCalendar, HiStar, HiTag, HiXMark } from "react-icons/hi2";

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
  const [data, setData] = useState({
    banners: [],
    promotions: [],
    categories: [],
    activity: [],
  });

  useEffect(() => {
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

  const SectionTitle = ({ title, viewAll = true }) => (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        <div className="w-20 h-1 mt-1 bg-[#0064D2] rounded-full" />
      </div>
      {viewAll && (
        <button className="flex items-center px-4 py-2 text-[#0064D2] transition-all duration-300 border border-[#0064D2] rounded-2xl hover:bg-[#0064D2] hover:text-white group">
          View all
          <HiChevronRight className="w-5 h-5 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F7FF]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-1">
              <span className="text-[#0064D2] text-3xl font-black">travel</span>
              <span className="text-[#FF6B6B] text-3xl font-black">
                .journey
              </span>
            </div>
            {/* Language Selector */}
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 space-x-2 text-gray-600 transition duration-200 rounded-full hover:bg-gray-50">
                <HiOutlineGlobeAlt className="w-5 h-5" />
                <span className="text-sm">English</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative mb-16 h-[80vh] overflow-hidden">
        {data.banners.length > 0 && (
          <>
            <div className="absolute inset-0">
              <img
                src={data.banners[0].imageUrl}
                alt={data.banners[0].name}
                className="object-cover w-full h-full transition-transform duration-[2s] hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
            </div>
            <div className="relative flex flex-col items-start justify-center h-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <h1 className="max-w-2xl mb-4 text-4xl font-bold text-white md:text-6xl">
                Discover Your Next
                <span className="block mt-2 text-[#0064D2]">Journey</span>
              </h1>
              <p className="max-w-xl mb-8 text-lg text-gray-300 md:text-xl">
                {data.banners[0].description}
              </p>
              <button className="px-8 py-4 font-semibold text-white transition duration-300 bg-[#0064D2] rounded-2xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30">
                Start Exploring
              </button>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="px-4 pb-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Categories Section */}
        <section className="mb-16">
          <SectionTitle title="Popular Categories" />
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {data.categories.map((category) => (
                <div
                  key={category.id}
                  className="relative overflow-hidden transition-all duration-300 bg-white shadow-sm group rounded-2xl hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="object-cover w-full h-full transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 transition-opacity duration-300 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-xl font-bold">{category.name}</h3>
                    <p className="mt-2 text-sm text-gray-200">
                      {category.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Promotions Section */}
        <section className="mb-16">
          <SectionTitle title="Special Offers" />
          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.promotions.map((promo) => (
                <div
                  key={promo.id}
                  className="overflow-hidden transition-all duration-300 bg-white shadow-sm group rounded-2xl hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="relative">
                    <img
                      src={promo.imageUrl}
                      alt={promo.title}
                      className="object-cover w-full h-48 transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute px-3 py-1 text-sm font-semibold text-white bg-[#FF6B6B] rounded-full top-4 right-4">
                      {promo.promo_discount_price}% OFF
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                      <HiCalendar className="w-4 h-4" />
                      <span>Limited time offer</span>
                    </div>
                    <h3 className="mb-2 text-xl font-bold transition-colors duration-300 group-hover:text-[#0064D2]">
                      {promo.title}
                    </h3>
                    <p className="mb-4 text-gray-600 line-clamp-2">
                      {promo.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center px-3 py-1 text-sm text-[#0064D2] bg-blue-100 rounded-full">
                        <HiTag className="w-4 h-4 mr-1" />
                        {promo.promo_code}
                      </div>
                      <button className="px-4 py-2 text-white transition duration-300 bg-[#0064D2] rounded-2xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30">
                        Claim Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Activities Section */}
        <section>
          <SectionTitle title="Featured Activities" />
          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.activity.map((item) => (
                <div
                  key={item.id}
                  className="relative overflow-hidden transition-all duration-300 bg-white shadow-sm group rounded-2xl hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={item.category.imageUrl}
                      alt={item.name}
                      className="object-cover w-full h-full transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <HiMapPin className="w-4 h-4" />
                      <span className="text-sm">{item.category.name}</span>
                    </div>
                    <h3 className="mb-2 text-xl font-bold">
                      {item.title || item.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <HiStar className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm">4.8 (120 reviews)</span>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-white transition duration-300 rounded-2xl bg-white/20 backdrop-blur-sm hover:bg-white/30">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {errorMessage && (
          <CustomAlert
            message={errorMessage}
            onClose={() => setErrorMessage(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
