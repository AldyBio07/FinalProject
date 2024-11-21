import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import axios from "axios";
import { HiSearch, HiOutlineX } from "react-icons/hi";
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

const ListTransaction = ({ transactions, error }) => {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const filtered = transactions.filter((transaction) => {
      const matchesStatus = selectedStatus
        ? transaction.status === selectedStatus
        : true;
      const matchesTitle = searchTitle
        ? transaction.transaction_items.some((item) =>
            item.title.toLowerCase().includes(searchTitle.toLowerCase())
          )
        : true;
      return matchesStatus && matchesTitle;
    });
    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTitle, selectedStatus, transactions]);

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
    setSearchTitle("");
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

  // Calculate pagination
  const indexOfLastTransaction = currentPage * itemsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
  const currentTransactions = formattedTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(formattedTransactions.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (error) {
    return <p className="mt-4 text-center text-red-500">{error}</p>;
  }

  const uniqueStatuses = [...new Set(transactions.map((tx) => tx.status))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Background Decorations */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-3xl transform -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-100/20 to-transparent rounded-full blur-3xl transform translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-50/10 via-white/5 to-blue-50/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDBNIDAgMjAgTCA0MCAyMCBNIDIwIDAgTCAyMCA0MCBNIDAgMzAgTCA0MCAzMCBNIDMwIDAgTCAzMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjA0N2ZmMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
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
              <h1 className="text-3xl font-extrabold text-[#0064D2] mb-6">
                Transaction Management
              </h1>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                    <HiSearch className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    placeholder="Search by item title..."
                    className="w-full py-3 pl-12 pr-10 text-gray-900 transition duration-200 border-2 border-gray-200 bg-gray-50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  {searchTitle && (
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
                  className="px-4 py-3 text-gray-600 transition duration-200 border-2 border-gray-200 bg-gray-50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 min-w-[180px]"
                >
                  <option value="">All Statuses</option>
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
            <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2 xl:grid-cols-3">
              {currentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="overflow-hidden transition duration-300 bg-white shadow-sm rounded-2xl hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        {transaction.invoiceId}
                      </h3>
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${
                          transaction.status === "success"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : transaction.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </div>

                    <div className="mb-4 space-y-2">
                      <p className="text-sm text-gray-600">
                        Amount: ${transaction.totalAmount}
                      </p>
                      <p className="text-sm text-gray-600">
                        Order Date: {transaction.orderDate}
                      </p>
                      <div className="flex items-center pt-2 space-x-2 border-t border-gray-100">
                        <img
                          src={transaction.payment_method?.imageUrl}
                          alt="Payment Method"
                          className="w-8 h-8"
                        />
                        <span className="text-sm text-gray-600">
                          {transaction.payment_method?.name}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {transaction.transaction_items.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 transition bg-gray-50 rounded-xl hover:bg-gray-100"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.imageUrls[0]}
                              alt={item.title}
                              className="object-cover w-16 h-16 rounded-lg"
                            />
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {item.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                ${item.price} × {item.quantity}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {transaction.status === "pending" && (
                      <button
                        onClick={() => openUpdateModal(transaction)}
                        className="w-full px-4 py-2.5 mt-4 text-white font-medium transition bg-[#0064D2] rounded-xl hover:bg-blue-700"
                      >
                        Update Status
                      </button>
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
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 transition duration-200 hover:bg-gray-50 rounded-l-xl disabled:opacity-50"
                >
                  First
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 transition duration-200 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 transition duration-200 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-lg p-6 bg-white shadow-xl rounded-2xl">
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Update Transaction Status
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Invoice ID
                </label>
                <p className="mt-1 text-gray-600">
                  {selectedTransaction.invoiceId}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Current Status
                </label>
                <p className="mt-1 text-gray-600">
                  {selectedTransaction.status}
                </p>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  New Status
                </label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                  className="w-full p-3 transition duration-200 border-2 border-gray-200 bg-gray-50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="pending">Pending</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={closeModal}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 transition duration-200 bg-gray-100 rounded-xl hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={loading}
                className={`px-6 py-2.5 text-sm font-medium text-white transition duration-200 rounded-xl ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-[#0064D2] hover:bg-blue-700"
                }`}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-white animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Updating...</span>
                  </div>
                ) : (
                  "Update Status"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListTransaction;
