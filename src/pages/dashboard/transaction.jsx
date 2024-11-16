import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { HiOutlineGlobeAlt, HiSearch, HiOutlineX } from "react-icons/hi";

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
    setFilteredTransactions(transactions);
  }, [transactions]);

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
    const status = e.target.value;
    setSelectedStatus(status);
    filterTransactions(status, searchTitle);
  };

  const handleTitleChange = (e) => {
    const title = e.target.value.toLowerCase();
    setSearchTitle(title);
    filterTransactions(selectedStatus, title);
  };

  const filterTransactions = (status, title) => {
    const filtered = transactions.filter((transaction) => {
      const matchesStatus = status ? transaction.status === status : true;
      const matchesTitle = title
        ? transaction.transaction_items.some((item) =>
            item.title.toLowerCase().includes(title)
          )
        : true;

      return matchesStatus && matchesTitle;
    });

    setFilteredTransactions(filtered);
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

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
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

  if (error) {
    return <p className="mt-4 text-center text-red-500">{error}</p>;
  }

  const uniqueStatuses = [...new Set(transactions.map((tx) => tx.status))];
  const paginatedTransactions = formattedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-[#F5F7FF]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <span className="text-[#0064D2] text-3xl font-black">travel</span>
              <span className="text-[#FF6B6B] text-3xl font-black">
                .journey
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 space-x-2 text-gray-600 transition duration-200 rounded-full hover:bg-gray-50">
                <HiOutlineGlobeAlt className="w-5 h-5" />
                <span className="text-sm">English</span>
              </button>
            </div>
          </div>
        </div>
      </header>

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
      <main className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Filter Bar */}
        <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <HiSearch className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by item title..."
              value={searchTitle}
              onChange={handleTitleChange}
              className="w-full py-3 pl-12 pr-10 transition duration-200 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {searchTitle && (
              <button
                onClick={() => setSearchTitle("")}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-gray-600"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            )}
          </div>
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="px-4 py-3 text-gray-600 transition duration-200 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:w-48"
          >
            <option value="">All Statuses</option>
            {uniqueStatuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Transactions Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="overflow-hidden transition-all duration-300 bg-white border border-gray-100 rounded-2xl hover:shadow-xl transform hover:scale-[1.02]"
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
                    <div key={idx} className="p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.imageUrls[0]}
                          alt={item.title}
                          className="w-16 h-16 rounded-lg"
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
                    className="w-full px-4 py-2.5 mt-4 text-blue-600 font-medium transition bg-blue-50 rounded-xl hover:bg-blue-100"
                  >
                    Update Status
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {formattedTransactions.length > itemsPerPage && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from(
              {
                length: Math.ceil(formattedTransactions.length / itemsPerPage),
              },
              (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-xl
                    ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>
        )}
      </main>

      {/* Update Status Modal */}
      {isModalOpen && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 mx-4 bg-white rounded-2xl">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Update Transaction Status
            </h2>

            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Select New Status
              </label>
              <select
                value={updateStatus}
                onChange={(e) => setUpdateStatus(e.target.value)}
                className="w-full px-4 py-3 transition duration-200 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="pending">Pending</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-6 py-2.5 text-gray-700 transition duration-200 bg-gray-100 rounded-xl hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={loading}
                className={`px-6 py-2.5 text-white transition duration-200 rounded-xl
                  ${
                    loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-white animate-spin"
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
                    <span>Loading...</span>
                  </div>
                ) : (
                  "Update"
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
