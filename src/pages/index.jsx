import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import {
  HiOutlineGlobeAlt,
  HiChevronRight,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi";
import {
  HiMapPin,
  HiCalendar,
  HiStar,
  HiTag,
  HiXMark,
  HiUserGroup,
  HiShieldCheck,
  HiCurrencyDollar,
  HiHeart,
  HiGlobeAmericas,
  HiChatBubbleBottomCenterText,
  HiSparkles,
  HiMiniGlobeAmericas,
  HiMiniSparkles,
  HiMiniRocketLaunch,
  HiMiniPresentationChartBar,
  HiMiniChatBubbleLeftRight,
  HiMiniBuildingOffice2,
  HiMiniMapPin,
  HiMiniHandThumbUp,
  HiMiniShieldCheck,
  HiMiniCurrencyDollar,
  HiMiniWallet,
  HiMiniClipboardDocumentCheck,
} from "react-icons/hi2";

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

  const renderPromotionCards = (promotions) => {
    return promotions.map((promo) => (
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
          <p className="mb-4 text-gray-600 line-clamp-2">{promo.description}</p>
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
    ));
  };

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
        <section className="relative mb-16">
          <SectionTitle title="Popular Categories" />
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="relative w-full overflow-hidden">
              <div className="flex gap-6 animate-marquee-infinite">
                {data.categories.map((category) => (
                  <div
                    key={category.id}
                    className="relative w-64 overflow-hidden transition-all duration-300 bg-white shadow-sm group rounded-2xl hover:shadow-xl hover:-translate-y-1 shrink-0"
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
                {/* Duplicate the first 3 categories to create a seamless loop */}
                {data.categories.slice(0, 3).map((category) => (
                  <div
                    key={`loop-${category.id}`}
                    className="relative w-64 overflow-hidden transition-all duration-300 bg-white shadow-sm group rounded-2xl hover:shadow-xl hover:-translate-y-1 shrink-0"
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
            </div>
          )}
        </section>

        {/* Promotions Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Special Offers
              </h2>
              <div className="w-20 h-1 mt-1 bg-[#0064D2] rounded-full" />
            </div>
            {data.promotions.length > 3 && (
              <button
                onClick={() => setShowAllPromotions(!showAllPromotions)}
                className="flex items-center px-4 py-2 text-[#0064D2] transition-all duration-300 border border-[#0064D2] rounded-2xl hover:bg-[#0064D2] hover:text-white group"
              >
                {showAllPromotions ? (
                  <>
                    Show Less
                    <HiChevronUp className="w-5 h-5 ml-1 transition-transform duration-300 group-hover:-translate-y-1" />
                  </>
                ) : (
                  <>
                    Get More
                    <HiChevronDown className="w-5 h-5 ml-1 transition-transform duration-300 group-hover:translate-y-1" />
                  </>
                )}
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {renderPromotionCards(
                showAllPromotions
                  ? data.promotions
                  : data.promotions.slice(0, 3)
              )}
            </div>
          )}
        </section>

        {/* Add this modernized Why Choose Us section */}
        <section className="py-20 mb-16">
          {/* Background Pattern */}
          <div className="absolute left-0 right-0 w-full h-full mx-auto max-w-7xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent rounded-[3rem] opacity-70" />
            <div className="absolute w-64 h-64 rounded-full -top-12 -right-12 bg-blue-50 blur-3xl opacity-30" />
            <div className="absolute w-64 h-64 rounded-full -bottom-12 -left-12 bg-blue-50 blur-3xl opacity-30" />
          </div>

          <div className="relative">
            {/* Section Header */}
            <div className="flex flex-col items-center mb-16 text-center">
              <span className="px-4 py-2 mb-4 text-sm font-medium text-[#0064D2] bg-blue-50 rounded-full">
                Why Choose Us
              </span>
              <h2 className="max-w-2xl mx-auto text-4xl font-bold text-gray-900 md:text-5xl">
                Your Journey, Our Passion
              </h2>
              <div className="w-20 h-1 mt-4 bg-[#0064D2] rounded-full" />
              <p className="max-w-2xl mt-6 text-lg text-gray-600">
                Experience travel like never before with our premium services
                and dedicated team
              </p>
            </div>

            {/* Feature Cards Grid */}
            {/* Update the Feature Cards with new icons and arrangements */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature Card 1 - Global Network */}
              <div className="relative p-8 transition-all duration-500 bg-white group hover:bg-[#0064D2] rounded-[2rem] hover:scale-105">
                <div className="absolute top-0 left-0 w-24 h-24 transition-all duration-500 bg-blue-50 rounded-br-[2rem] group-hover:bg-white/10" />
                <div className="relative">
                  <div className="flex items-center justify-center w-16 h-16">
                    <div className="relative">
                      <HiMiniGlobeAmericas className="w-8 h-8 text-[#0064D2] group-hover:text-white transition-colors duration-500" />
                      <HiMiniRocketLaunch className="absolute w-4 h-4 text-[#FF6B6B] -right-1 -top-1 transform rotate-45" />
                    </div>
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-gray-900 transition-colors duration-500 group-hover:text-white">
                    Global Adventures
                  </h3>
                  <p className="mt-4 text-gray-600 transition-colors duration-500 group-hover:text-white/80">
                    Access to over 1000+ destinations worldwide with exclusive
                    local partnerships
                  </p>
                  <div className="flex items-center mt-8 text-[#0064D2] group-hover:text-white transition-colors duration-500">
                    <span className="text-sm font-medium">
                      Explore destinations
                    </span>
                    <HiChevronRight className="w-5 h-5 ml-2 transition-transform duration-500 group-hover:translate-x-2" />
                  </div>
                </div>
              </div>

              {/* Feature Card 2 - Premium Experience */}
              <div className="relative p-8 transition-all duration-500 bg-white group hover:bg-[#0064D2] rounded-[2rem] hover:scale-105">
                <div className="absolute top-0 left-0 w-24 h-24 transition-all duration-500 bg-blue-50 rounded-br-[2rem] group-hover:bg-white/10" />
                <div className="relative">
                  <div className="flex items-center justify-center w-16 h-16">
                    <div className="relative">
                      <HiMiniSparkles className="w-8 h-8 text-[#0064D2] group-hover:text-white transition-colors duration-500" />
                      <HiMiniHandThumbUp className="absolute w-4 h-4 text-[#FF6B6B] -right-1 -bottom-1" />
                    </div>
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-gray-900 transition-colors duration-500 group-hover:text-white">
                    Luxury Experience
                  </h3>
                  <p className="mt-4 text-gray-600 transition-colors duration-500 group-hover:text-white/80">
                    Curated premium experiences with attention to every detail
                    of your journey
                  </p>
                  <div className="flex items-center mt-8 text-[#0064D2] group-hover:text-white transition-colors duration-500">
                    <span className="text-sm font-medium">Discover luxury</span>
                    <HiChevronRight className="w-5 h-5 ml-2 transition-transform duration-500 group-hover:translate-x-2" />
                  </div>
                </div>
              </div>

              {/* Feature Card 3 - Support */}
              <div className="relative p-8 transition-all duration-500 bg-white group hover:bg-[#0064D2] rounded-[2rem] hover:scale-105">
                <div className="absolute top-0 left-0 w-24 h-24 transition-all duration-500 bg-blue-50 rounded-br-[2rem] group-hover:bg-white/10" />
                <div className="relative">
                  <div className="flex items-center justify-center w-16 h-16">
                    <div className="relative">
                      <HiMiniChatBubbleLeftRight className="w-8 h-8 text-[#0064D2] group-hover:text-white transition-colors duration-500" />
                      <HiMiniShieldCheck className="absolute w-4 h-4 text-[#FF6B6B] -right-1 -top-1" />
                    </div>
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-gray-900 transition-colors duration-500 group-hover:text-white">
                    24/7 Expert Support
                  </h3>
                  <p className="mt-4 text-gray-600 transition-colors duration-500 group-hover:text-white/80">
                    Round-the-clock assistance from our dedicated travel
                    specialists
                  </p>
                  <div className="flex items-center mt-8 text-[#0064D2] group-hover:text-white transition-colors duration-500">
                    <span className="text-sm font-medium">
                      Learn about support
                    </span>
                    <HiChevronRight className="w-5 h-5 ml-2 transition-transform duration-500 group-hover:translate-x-2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section with Updated Icons */}
            <div className="mt-20">
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                {/* Stat 1 */}
                <div className="relative flex flex-col items-center p-6 overflow-hidden bg-white group rounded-[2rem]">
                  <div className="absolute inset-0 transition-transform duration-700 translate-x-full bg-gradient-to-r from-blue-50/50 to-transparent group-hover:translate-x-0" />
                  <div className="relative">
                    <div className="flex items-center justify-center mb-4">
                      <HiMiniHandThumbUp className="w-8 h-8 text-[#0064D2]" />
                    </div>
                    <div className="text-4xl font-bold text-center text-[#0064D2]">
                      500K+
                    </div>
                    <div className="mt-2 text-sm font-medium text-center text-gray-600">
                      Happy Travelers
                    </div>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="relative flex flex-col items-center p-6 overflow-hidden bg-white group rounded-[2rem]">
                  <div className="absolute inset-0 transition-transform duration-700 translate-x-full bg-gradient-to-r from-blue-50/50 to-transparent group-hover:translate-x-0" />
                  <div className="relative">
                    <div className="flex items-center justify-center mb-4">
                      <HiMiniMapPin className="w-8 h-8 text-[#0064D2]" />
                    </div>
                    <div className="text-4xl font-bold text-center text-[#0064D2]">
                      1000+
                    </div>
                    <div className="mt-2 text-sm font-medium text-center text-gray-600">
                      Destinations
                    </div>
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="relative flex flex-col items-center p-6 overflow-hidden bg-white group rounded-[2rem]">
                  <div className="absolute inset-0 transition-transform duration-700 translate-x-full bg-gradient-to-r from-blue-50/50 to-transparent group-hover:translate-x-0" />
                  <div className="relative">
                    <div className="flex items-center justify-center mb-4">
                      <HiMiniClipboardDocumentCheck className="w-8 h-8 text-[#0064D2]" />
                    </div>
                    <div className="text-4xl font-bold text-center text-[#0064D2]">
                      98%
                    </div>
                    <div className="mt-2 text-sm font-medium text-center text-gray-600">
                      Satisfaction Rate
                    </div>
                  </div>
                </div>

                {/* Stat 4 */}
                <div className="relative flex flex-col items-center p-6 overflow-hidden bg-white group rounded-[2rem]">
                  <div className="absolute inset-0 transition-transform duration-700 translate-x-full bg-gradient-to-r from-blue-50/50 to-transparent group-hover:translate-x-0" />
                  <div className="relative">
                    <div className="flex items-center justify-center mb-4">
                      <HiMiniChatBubbleLeftRight className="w-8 h-8 text-[#0064D2]" />
                    </div>
                    <div className="text-4xl font-bold text-center text-[#0064D2]">
                      24/7
                    </div>
                    <div className="mt-2 text-sm font-medium text-center text-gray-600">
                      Support Available
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Activities Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Featured Activities
              </h2>
              <div className="w-20 h-1 mt-1 bg-[#0064D2] rounded-full" />
            </div>
            {data.activity.length > 3 && (
              <button
                onClick={() => setShowAllActivities(!showAllActivities)}
                className="flex items-center px-4 py-2 text-[#0064D2] transition-all duration-300 border border-[#0064D2] rounded-2xl hover:bg-[#0064D2] hover:text-white group"
              >
                {showAllActivities ? (
                  <>
                    Show Less
                    <HiChevronUp className="w-5 h-5 ml-1 transition-transform duration-300 group-hover:-translate-y-1" />
                  </>
                ) : (
                  <>
                    Get More
                    <HiChevronDown className="w-5 h-5 ml-1 transition-transform duration-300 group-hover:translate-y-1" />
                  </>
                )}
              </button>
            )}
          </div>
          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(showAllActivities
                ? data.activity
                : data.activity.slice(0, 3)
              ).map((item) => (
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
