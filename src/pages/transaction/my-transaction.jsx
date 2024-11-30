import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Clock,
  Package,
  Receipt,
  ShoppingBag,
  CreditCard,
  Upload,
} from "lucide-react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { uploadImage } from "@/helper/uploadImage";
import Navbar from "@/components/Navbar";

const MyTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState(null);
  const router = useRouter();

  const defaultImageUrl =
    "https://placehold.co/100x100/e2e8f0/1e293b?text=No+Image";

  const showNotification = (message, isError = false) => {
    setNotification({
      message,
      type: isError ? "error" : "success",
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchTransactions = async () => {
    const token = getCookie("token");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const response = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/my-transactions",
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTransactions(response.data.data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to fetch transactions.");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadProof = async (transactionId, file) => {
    const token = getCookie("token");
    setUploading(true);

    try {
      const imageUrl = await uploadImage(file);

      await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-transaction-proof-payment/${transactionId}`,
        { proofPaymentUrl: imageUrl },
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showNotification("Payment proof uploaded successfully!");
      fetchTransactions();
    } catch (error) {
      console.error("Error uploading proof:", error);
      showNotification(
        error.response?.data?.message || "Failed to upload payment proof",
        true
      );
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-600";
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg p-4 mx-auto mt-8 text-red-600 rounded-lg bg-red-50">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen text-black bg-gray-50">
      <Navbar />
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

      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold">My Transactions</h1>
              <span className="px-2 py-1 text-sm text-blue-600 bg-blue-100 rounded-full">
                {transactions.length} orders
              </span>
            </div>
            <button
              onClick={() => router.push("/activity")}
              className="px-4 py-2 text-sm font-medium text-blue-600 transition-colors rounded-full bg-blue-50 hover:bg-blue-100"
            >
              Browse Activities
            </button>
          </div>
        </div>
      </div>

      <div className="container p-4 mx-auto mt-4">
        {transactions.length === 0 ? (
          <div className="max-w-md p-8 mx-auto bg-white rounded-lg shadow-sm">
            <div className="flex flex-col items-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
              <p className="mt-4 text-lg">No transactions found</p>
              <button
                onClick={() => router.push("/activity")}
                className="px-6 py-2 mt-4 text-sm font-medium text-white transition-colors bg-blue-600 rounded-full hover:bg-blue-700"
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="overflow-hidden transition-shadow bg-white rounded-lg shadow-sm hover:shadow-md"
              >
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Package className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Order ID
                        </p>
                        <p className="font-medium">{transaction.invoiceId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                          transaction.status
                        )}`}
                      >
                        {transaction.status}
                      </span>
                      <div className="flex items-center justify-end gap-1 mt-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {formatDate(transaction.orderDate)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="divide-y">
                  {transaction.transaction_items.map((item) => (
                    <div key={item.id} className="p-4">
                      <div className="flex gap-4">
                        <div className="relative w-20 h-20 overflow-hidden bg-gray-100 rounded-lg">
                          <img
                            src={item.imageUrls?.[0] || defaultImageUrl}
                            alt={item.title}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              e.target.src = defaultImageUrl;
                            }}
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium line-clamp-1">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className="px-2 py-1 text-sm bg-gray-100 rounded-full">
                              Qty: {item.quantity}
                            </span>
                            <div className="flex items-center gap-2">
                              {item.price !== item.price_discount && (
                                <span className="text-sm text-gray-500 line-through">
                                  Rp {item.price.toLocaleString()}
                                </span>
                              )}
                              <span className="text-sm font-medium text-blue-600">
                                Rp {item.price_discount.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {transaction.payment_method.name} -{" "}
                      {transaction.payment_method.virtual_account_number}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total Amount</span>
                    <span className="text-lg font-semibold text-blue-600">
                      Rp {transaction.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  {/* Payment Proof Upload Section */}
                  {transaction.status.toLowerCase() === "pending" && (
                    <div className="pt-4 mt-4 border-t">
                      {transaction.proofPaymentUrl ? (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">
                            Payment Proof Uploaded
                          </p>
                          <img
                            src={transaction.proofPaymentUrl}
                            alt="Payment Proof"
                            className="object-cover w-full h-32 rounded-lg"
                            onError={(e) => {
                              e.target.src = defaultImageUrl;
                              e.target.className =
                                "object-contain w-full h-32 rounded-lg";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                // Basic file validation
                                if (file.size > 5 * 1024 * 1024) {
                                  showNotification(
                                    "File size must be less than 5MB",
                                    true
                                  );
                                  return;
                                }
                                if (!file.type.startsWith("image/")) {
                                  showNotification(
                                    "Please upload an image file",
                                    true
                                  );
                                  return;
                                }
                                handleUploadProof(transaction.id, file);
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={uploading}
                          />
                          <button
                            className={`w-full px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 ${
                              uploading ? "opacity-75 cursor-not-allowed" : ""
                            }`}
                            disabled={uploading}
                          >
                            {uploading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4" />
                                <span>Upload Payment Proof</span>
                              </>
                            )}
                          </button>
                          <p className="mt-2 text-xs text-gray-500">
                            Maximum file size: 5MB. Supported formats: JPG, PNG,
                            GIF
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTransactions;
