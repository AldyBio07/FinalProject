import React from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getCookie } from "cookies-next";
import Navbar from "@/components/Navbar";
import { Calendar, DollarSign, Tag, FileText } from "lucide-react";

export async function getServerSideProps({ params }) {
  try {
    const response = await axios.get(
      `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promo/${params.id}`,
      {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        },
      }
    );

    return {
      props: {
        promo: response.data.data || null,
      },
    };
  } catch (error) {
    console.error("Error fetching promo details:", error);
    return {
      redirect: {
        destination: "/promo",
        permanent: false,
      },
    };
  }
}

const PromoDetails = ({ promo }) => {
  const router = useRouter();

  if (!promo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Promo not found</h1>
          <button
            onClick={() => router.push("/promo")}
            className="px-4 py-2 mt-4 text-white bg-[#101827] rounded-xl hover:bg-blue-700"
          >
            Back to Promos
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(promo.createdAt).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar />

      <main className="container px-4 pt-24 pb-12 mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push("/promo")}
            className="flex items-center mb-6 text-gray-600 hover:text-gray-900"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Promos
          </button>

          {/* Main Content Card */}
          <div className="overflow-hidden bg-white shadow-xl rounded-2xl">
            {/* Hero Image */}
            <div className="relative h-96">
              <img
                src={promo.imageUrl}
                alt={promo.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/60 to-transparent">
                <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-[#FF6910] rounded-full">
                  {promo.promo_code}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <h1 className="mb-4 text-3xl font-bold text-gray-900">
                {promo.title}
              </h1>

              <div className="grid gap-6 mb-8 lg:grid-cols-2">
                {/* Left Column - Details */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-5 h-5 text-[#FF6910]" />
                    <span>Valid until: {formattedDate}</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600">
                    <DollarSign className="w-5 h-5 text-[#FF6910]" />
                    <div>
                      <p>
                        Discount Price:{" "}
                        <span className="font-semibold text-[#FF6910]">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(promo.promo_discount_price)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600">
                    <Tag className="w-5 h-5 text-[#FF6910]" />
                    <div>
                      <p>
                        Minimum Purchase:{" "}
                        <span className="font-semibold">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(promo.minimum_claim_price)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Description */}
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      Description
                    </h3>
                    <p className="text-gray-600">{promo.description}</p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      Terms & Conditions
                    </h3>
                    <div
                      className="prose text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html: promo.terms_condition,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-center pt-6 mt-8 border-t">
                <button
                  onClick={() => {
                    /* Add your claim logic here */
                  }}
                  className="px-8 py-3 text-lg font-medium text-white transition-colors bg-[#FF6910] rounded-xl hover:bg-[#FF8A48] focus:outline-none focus:ring-2 focus:ring-[#FF6910] focus:ring-offset-2"
                >
                  Claim Promo
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PromoDetails;
