import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import axios from "axios";

const MyTransactions = () => {
  const token = getCookie("token");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!token) {
        return {
          redirect: {
            destination: "/auth/login",
            permanent: false,
          },
        };
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
        setTransactions(response.data.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">My Transactions</h1>
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="p-4 mb-4 bg-white rounded-lg shadow-md"
        >
          <p className="text-lg font-semibold">{transaction.invoiceId}</p>
          <p>Status: {transaction.status}</p>
          <p>Total Amount: {transaction.totalAmount}</p>
          <p>Order Date: {transaction.orderDate}</p>
          <div className="mt-4">
            <h2 className="mb-2 text-xl font-semibold">Transaction Items</h2>
            {transaction.transaction_items.map((item) => (
              <div key={item.id} className="py-2 border-t border-gray-200">
                <p className="font-semibold">{item.title}</p>
                <p>{item.description}</p>
                <p>Price: {item.price}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyTransactions;
