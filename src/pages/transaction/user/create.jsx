import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getCookie } from "cookies-next";

const TransactionCreate = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/payment-methods",
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            },
          }
        );
        setPaymentMethods(response.data.data);
      } catch (error) {
        console.error("Error fetching payment methods:", error);
        setError("Failed to fetch payment methods.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  const handlePaymentMethodChange = (paymentMethodId) => {
    setSelectedPaymentMethod(paymentMethodId);
  };

  const handleCheckout = async () => {
    const token = getCookie("token");
    const selectedCartIds = router.query.cartIds;

    if (!token || !selectedCartIds || !selectedPaymentMethod) {
      console.error("Missing required data for checkout");
      setError("Unable to complete checkout. Please try again.");
      return;
    }

    try {
      await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-transaction",
        {
          cartIds: selectedCartIds,
          paymentMethodId: selectedPaymentMethod,
        },
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      router.push("/transaction/success");
    } catch (error) {
      console.error("Error creating transaction:", error);
      setError("Failed to create transaction. Please try again.");
    }
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
    <div className="min-h-screen bg-gray-50">
      <div className="container p-4 mx-auto">
        <h1 className="mb-4 text-2xl font-bold">Choose Payment Method</h1>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {paymentMethods.map((method) => (
            <label
              key={method.id}
              className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer ${
                selectedPaymentMethod === method.id ? "border-blue-500" : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selectedPaymentMethod === method.id}
                onChange={() => handlePaymentMethodChange(method.id)}
                className="hidden"
              />
              <img
                src={method.imageUrl}
                alt={method.name}
                className="w-20 h-20 mb-2"
              />
              <span>{method.name}</span>
            </label>
          ))}
        </div>
        <button
          onClick={handleCheckout}
          disabled={!selectedPaymentMethod}
          className="px-4 py-2 mt-8 text-white bg-blue-500 rounded disabled:bg-gray-400"
        >
          Complete Checkout
        </button>
      </div>
    </div>
  );
};

export default TransactionCreate;
