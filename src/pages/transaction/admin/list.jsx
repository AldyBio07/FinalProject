import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";

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
        transactions: transactionRes.data.data || [], // Ensure it's an array
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

  if (error) {
    return <p className="mt-4 text-center text-red-500">{error}</p>;
  }

  const uniqueStatuses = [...new Set(transactions.map((tx) => tx.status))]; // Extract unique statuses

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-center">Transaction List</h1>

      {/* Filter Bar */}
      <div className="flex justify-center mb-4">
        <select
          value={selectedStatus}
          onChange={handleStatusChange}
          className="w-full max-w-lg p-2 mr-4 border border-gray-300 rounded-lg shadow-md"
        >
          <option className="text-gray-950" value="">
            All Statuses
          </option>
          {uniqueStatuses.map((status) => (
            <option key={status} value={status} className="text-gray-950">
              {status}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search by item title"
          value={searchTitle}
          onChange={handleTitleChange}
          className="w-full max-w-lg p-2 border border-gray-300 rounded-lg shadow-md text-gray-950"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {formattedTransactions.length > 0 ? (
          formattedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg text-gray-950"
            >
              <h2 className="mb-2 text-lg font-semibold">
                Transaction ID: {transaction.invoiceId}
              </h2>
              <p className="text-sm text-gray-950">
                Status:{" "}
                <span className="font-medium">{transaction.status}</span>
              </p>
              <p className="text-sm text-gray-950">
                Total Amount:{" "}
                <span className="font-medium">${transaction.totalAmount}</span>
              </p>
              <p className="text-sm text-gray-950">
                Order Date:{" "}
                <span className="font-medium">{transaction.orderDate}</span>
              </p>
              <p className="text-sm text-gray-950">
                Expiration Date:{" "}
                <span className="font-medium">{transaction.expiredDate}</span>
              </p>

              {/* Payment Method */}
              <div className="mt-4">
                <h3 className="font-semibold text-md">Payment Method:</h3>
                <p className="text-sm text-gray-950">
                  Method: {transaction.payment_method?.name}
                </p>
                <p className="text-sm text-gray-950">
                  Account Number:{" "}
                  {transaction.payment_method?.virtual_account_number}
                </p>
                <img
                  src={transaction.payment_method?.imageUrl}
                  alt="Payment Method Logo"
                  width={50}
                  className="mt-2"
                />
              </div>

              {/* Transaction Items */}
              <div className="mt-4">
                <h3 className="font-semibold text-gray-950 text-md">Items:</h3>
                {transaction.transaction_items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 mt-2 rounded-md text-gray-950 bg-gray-50"
                  >
                    <h4 className="text-sm font-semibold text-gray-950">
                      {item.title}
                    </h4>
                    <img
                      src={item.imageUrls[0]}
                      alt={item.title}
                      className="w-24 h-24 mt-2 rounded-md"
                    />
                    <p className="text-sm text-gray-950">
                      Description: {item.description}
                    </p>
                    <p className="text-sm text-gray-950">
                      Price: ${item.price}
                    </p>
                    <p className="text-sm text-gray-950">
                      Discount: {item.price_discount}%
                    </p>
                    <p className="text-sm text-gray-950">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No transactions found.
          </p>
        )}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => router.push("/transaction/create")}
          className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600"
        >
          Create Transaction
        </button>
      </div>
    </div>
  );
};

export default ListTransaction;
