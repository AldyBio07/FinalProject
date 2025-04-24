import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getCookie } from "cookies-next";
import { uploadImage } from "@/helper/uploadImage";
import {
  Pencil,
  Trash2,
  X,
  Upload,
  Plus,
  Save,
  PlusCircle,
} from "lucide-react";
import {
  HiSearch,
  HiOutlineX,
  HiUpload,
  HiClipboardList,
} from "react-icons/hi";

import Navbar from "@/components/Navbar";

export async function getServerSideProps() {
  try {
    const promosResponse = await axios.get(
      "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promos",
      {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        },
      }
    );

    return {
      props: {
        initialPromos: promosResponse.data.data || [],
      },
    };
  } catch (error) {
    console.error("Error fetching promos:", error);
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
}

const Promo = ({ initialPromos = [] }) => {
  const router = useRouter();
  const [promos, setPromos] = useState(initialPromos);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    terms_condition: "",
    promo_code: "",
    promo_discount_price: "",
    minimum_claim_price: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [filteredPromos, setFilteredPromos] = useState(promos);
  const itemsPerPage = 6;

  useEffect(() => {
    const filtered = promos.filter((promo) =>
      promo.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPromos(filtered);
    setCurrentPage(1);
  }, [searchQuery, promos]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handlePromoClick = (promoId) => {
    console.log("Promo clicked:", promoId);
    router.push(`/promo/${promoId}`);
  };

  const fetchPromos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promos",
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPromos(response.data.data || []);
    } catch (error) {
      console.error("Error fetching promos:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      terms_condition: "",
      promo_code: "",
      promo_discount_price: "",
      minimum_claim_price: "",
    });
    setSelectedPromo(null);
  };

  // Pagination calculations
  const indexOfLastPromo = currentPage * itemsPerPage;
  const indexOfFirstPromo = indexOfLastPromo - itemsPerPage;
  const currentPromos = filteredPromos.slice(
    indexOfFirstPromo,
    indexOfLastPromo
  );
  const totalPages = Math.ceil(filteredPromos.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Background Decorations */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 transform -translate-y-1/2 rounded-full w-96 h-96 bg-gradient-to-br from-blue-100/20 to-transparent blur-3xl translate-x-1/4" />
        <div className="absolute bottom-0 left-0 transform translate-y-1/2 rounded-full w-96 h-96 bg-gradient-to-tr from-blue-100/20 to-transparent blur-3xl -translate-x-1/4" />
      </div>

      <Navbar />

      {/* Main Content Area */}

      {/* Main Content */}
      <main className="flex-1 p-6 mt-16 mb-6">
        {/* Promos Grid */}
        {currentPromos.length === 0 ? (
          <div className="p-8 text-center bg-white shadow-sm rounded-2xl">
            <p className="text-xl font-semibold text-gray-600">
              No promos found
            </p>
            <p className="mt-2 text-gray-500">
              Try adjusting your search criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3">
            {currentPromos.map((promo) => (
              <div
                key={promo.id}
                onClick={() => handlePromoClick(promo.id)}
                className="relative overflow-hidden transition-all duration-300 bg-[#101827] group rounded-2xl hover:bg-[#D9E2E8] cursor-pointer transform hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image Section */}
                <div className="relative overflow-hidden h-96">
                  <img
                    src={promo.imageUrl}
                    alt={promo.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content Section */}
                <div className="p-5">
                  {/* Promo Badge */}
                  <div className="mb-3">
                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 rounded-full bg-blue-50">
                      {promo.promo_code}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-lg font-bold text-[#FF6910] line-clamp-1">
                    {promo.title}
                  </h3>

                  {/* Price Section */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      Rp.{promo.promo_discount_price}
                    </span>
                    <span className="text-sm text-gray-400">
                      Min. Rp.{promo.minimum_claim_price}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mb-4 text-sm text-gray-500 line-clamp-2">
                    {promo.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="sticky flex justify-center bottom-6">
            <div className="inline-flex bg-white divide-x divide-gray-200 shadow-sm rounded-xl">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 transition duration-200 hover:bg-gray-50 rounded-l-xl disabled:opacity-50"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 transition duration-200 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 transition duration-200 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 transition duration-200 hover:bg-gray-50 rounded-r-xl disabled:opacity-50"
              >
                Last
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 transition-opacity bg-black/60 backdrop-blur-sm" />

          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative w-full max-w-2xl transition-all transform bg-white shadow-2xl rounded-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Pencil className="w-6 h-6 text-blue-500" />
                      <span>Edit Promo</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <PlusCircle className="w-6 h-6 text-blue-500" />
                      <span>Add New Promo</span>
                    </div>
                  )}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 transition-colors rounded-full hover:text-gray-600 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promo;
