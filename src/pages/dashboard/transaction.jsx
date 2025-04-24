import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getCookie } from "cookies-next";
import { Pencil, Trash2, X, Plus, Save, PlusCircle } from "lucide-react";
import { HiSearch, HiOutlineX, HiClipboardList } from "react-icons/hi";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

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
    const transactionRes = await axios.get(
      "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/all-transactions",
      {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      props: {
        transactions: transactionRes.data.data || [],
      },
    };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return {
      props: {
        transactions: [],
        error: "Failed to fetch transactions. Please try again later.",
      },
    };
  }
}

const AdminTransaction = ({ transactions, error }) => {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);
  const [formattedTransactions, setFormattedTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [updateStatus, setUpdateStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const filtered = transactions.filter((transaction) => {
      const matchesStatus = selectedStatus
        ? transaction.status === selectedStatus
        : true;
      const matchesTitle = searchQuery
        ? transaction.transaction_items.some((item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : true;
      return matchesStatus && matchesTitle;
    });
    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, transactions]);

  useEffect(() => {
    const formatDates = () => {
      const formatted = filteredTransactions.map((transaction) => ({
        ...transaction,
        orderDate: new Date(transaction.orderDate).toLocaleString("en-US"),
        expiredDate: new Date(transaction.expiredDate).toLocaleString("en-US"),
      }));
      setFormattedTransactions(formatted);
    };

    formatDates();
  }, [filteredTransactions]);

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  };

  const openUpdateModal = (transaction) => {
    setSelectedTransaction(transaction);
    setUpdateStatus(transaction.status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
    setUpdateStatus("");
  };

  const handleUpdateStatus = async () => {
    setLoading(true);
    try {
      await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-transaction-status/${selectedTransaction.id}`,
        { status: updateStatus },
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      showNotification("Transaction status updated successfully");
      router.replace(router.asPath);
      closeModal();
    } catch (error) {
      console.error("Error updating transaction status:", error);
      showNotification("Failed to update transaction status", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatToRupiah = (amount) => {
    // Mengubah angka menjadi string dan memisahkan dengan titik setiap 3 digit
    const numberFormat = new Intl.NumberFormat("id-ID");

    // Mengembalikan format Rupiah

    return `Rp ${numberFormat.format(amount)}`;
  };

  // Pagination calculations
  const indexOfLastTransaction = currentPage * itemsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
  const currentTransactions = formattedTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(formattedTransactions.length / itemsPerPage);

  if (error) {
    return <p className="mt-4 text-center text-red-500">{error}</p>;
  }

  const uniqueStatuses = [...new Set(transactions.map((tx) => tx.status))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Background Decorations */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 transform -translate-y-1/2 rounded-full w-96 h-96 bg-gradient-to-br from-blue-100/20 to-transparent blur-3xl translate-x-1/4" />
        <div className="absolute bottom-0 left-0 transform translate-y-1/2 rounded-full w-96 h-96 bg-gradient-to-tr from-blue-100/20 to-transparent blur-3xl -translate-x-1/4" />
      </div>

      {/* Sidebar */}
      <div className="fixed left-0 z-30 w-64 h-full">
        <Sidebar role="admin" />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 ml-64">
        {/* Fixed Navbar */}
        <div className="fixed top-0 right-0 z-20 bg-white shadow-sm left-64">
          <Navbar role="admin" />
        </div>

        {/* Notification */}
        {notification.show && (
          <div
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-2xl shadow-lg ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            } transition-all duration-300 transform`}
          >
            {notification.message}
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 mt-16 mb-6">
          {/* Page Header & Search */}
          <div className="p-6 mb-8 bg-white shadow-sm rounded-2xl">
            <div className="max-w-4xl mx-auto">
              <h1 className="mb-6 text-3xl font-extrabold text-[#101827]">
                Transaction Management
              </h1>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                    <HiSearch className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search transactions..."
                    className="w-full py-3 pl-12 pr-10 text-gray-900 transition duration-200 border-2 border-gray-200 bg-gray-50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-gray-600"
                    >
                      <HiOutlineX className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <select
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  className="px-4 py-3 text-gray-700 transition duration-200 border-2 border-gray-200 bg-gray-50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 min-w-[180px]"
                >
                  <option value="">Choose Status</option>
                  {uniqueStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Transactions Grid */}
          {currentTransactions.length === 0 ? (
            <div className="p-8 text-center bg-white shadow-sm rounded-2xl">
              <p className="text-xl font-semibold text-gray-600">
                No transactions found
              </p>
              <p className="mt-2 text-gray-500">
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3">
              {currentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="relative overflow-hidden transition-all duration-300 bg-[#101827] group rounded-2xl hover:bg-[#D9E2E8]"
                >
                  {/* Content Section */}
                  <div className="p-5">
                    {/* Status Badge */}
                    <div className="mb-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                          transaction.status === "success"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : transaction.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </div>

                    {/* Invoice ID */}
                    <h3 className="mb-2 text-lg font-bold text-[#FF6910] line-clamp-1">
                      {transaction.invoiceId}
                    </h3>

                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-bold text-blue-600">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(transaction.totalAmount)}
                      </span>
                    </div>
                    <div className="text-sm text-white">
                      {transaction.orderDate}
                    </div>
                    <br />

                    {/* Items */}
                    <h3 className="mb-2 text-lg font-bold text-[#FF6910] line-clamp-1">
                      Items :
                    </h3>
                    <div className="mb-4 space-y-3">
                      {transaction.transaction_items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center p-2 space-x-3 bg-gray-50 rounded-xl"
                        >
                          <img
                            src={item.imageUrls[0]}
                            alt={item.title}
                            className="object-cover w-12 h-12 rounded-lg"
                          />
                          <div>
                            <p className="font-medium text-[#FF6910] line-clamp-1">
                              {item.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              }).format(item.price)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Qty : {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Payment Method */}

                    <h3 className="mb-2 text-lg font-bold text-[#FF6910] line-clamp-1">
                      Payment Method :
                    </h3>
                    <div className="flex items-center p-3 mb-4 space-x-2 bg-gray-50 rounded-xl">
                      <img
                        src={transaction.payment_method?.imageUrl}
                        alt={transaction.payment_method?.name}
                        className="w-8 h-8"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {transaction.payment_method?.name}
                      </span>
                    </div>

                    {/* Action Button */}
                    {transaction.status === "pending" && (
                      <div className="flex gap-2 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => openUpdateModal(transaction)}
                          className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                          title="Update Status"
                        >
                          <Pencil className="w-4 h-4" />
                          Update Status
                        </button>
                      </div>
                    )}
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
      </div>

      {/* Update Status Modal */}
      {isModalOpen && selectedTransaction && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 transition-opacity bg-black/60 backdrop-blur-sm" />

          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative w-full max-w-2xl transition-all transform bg-white shadow-2xl rounded-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800">
                  <div className="flex items-center gap-2">
                    <Pencil className="w-6 h-6 text-blue-500" />
                    <span>Update Transaction Status</span>
                  </div>
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 transition-colors rounded-full hover:text-gray-600 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Invoice ID */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Invoice ID
                  </label>
                  <p className="px-4 py-3 text-gray-900 bg-gray-50 rounded-xl">
                    {selectedTransaction.invoiceId}
                  </p>
                </div>

                {/* Current Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Current Status
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-1xs font-medium rounded-full ${
                        selectedTransaction.status === "success"
                          ? "bg-green-100 text-green-800"
                          : selectedTransaction.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedTransaction.status === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedTransaction.status}
                    </span>
                  </div>
                </div>

                {/* New Status Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    New Status
                  </label>
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    className="w-full px-4 py-3 text-black transition-all border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">Select New Status</option>
                    <option value="success">Success</option>

                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Transaction Summary */}
                <div className="p-4 space-y-3 bg-gray-50 rounded-xl">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Amount:</span>
                    <span className="font-medium text-gray-900">
                      Rp.{selectedTransaction.totalAmount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Order Date:</span>
                    <span className="font-medium text-gray-900">
                      {selectedTransaction.orderDate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Items Count:</span>
                    <span className="font-medium text-gray-900">
                      {selectedTransaction.transaction_items.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={loading}
                  className={`
                    px-5 py-2.5 text-sm font-medium text-white rounded-lg
                    transition-all focus:outline-none focus:ring-4 focus:ring-blue-100
                    ${
                      loading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }
                  `}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Updating Status...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      <span>Update Status</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransaction;
