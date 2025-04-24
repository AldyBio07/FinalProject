import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Check, Minus, Plus, ShoppingBag, X } from "lucide-react";
import axios from "axios";
import { getCookie } from "cookies-next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [creatingTransaction, setCreatingTransaction] = useState(false);
  const router = useRouter();

  // Function to fetch cart data
  const fetchCartData = async () => {
    const token = getCookie("token");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const response = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/carts",
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems(response.data.data || []);
      // Initialize selected items
      setSelectedItems(new Set(response.data.data.map((item) => item.id)));
    } catch (error) {
      console.error("Error fetching cart data:", error);
      setError("Failed to fetch cart data.");
    } finally {
      setLoading(false);
    }
  };

  // Function to update cart quantity
  const updateCartQuantity = async (cartId, quantity) => {
    const token = getCookie("token");
    try {
      await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-cart/${cartId}`,
        { quantity },
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCartData();
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  const handleQuantityChange = (cartId, newQuantity) => {
    if (newQuantity < 1) newQuantity = 1;
    updateCartQuantity(cartId, newQuantity);
  };

  const removeFromCart = async (cartId) => {
    const token = getCookie("token");
    try {
      await axios.delete(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-cart/${cartId}`,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(cartId);
        return newSet;
      });
      fetchCartData();
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const toggleAllItems = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map((item) => item.id)));
    }
  };

  // Fetch payment methods
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
    }
  };

  // Create transaction
  const handleCheckout = async () => {
    const token = getCookie("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    if (selectedItems.size === 0 || !selectedPaymentMethod) {
      return;
    }

    setCreatingTransaction(true);

    try {
      const response = await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-transaction",
        {
          cartIds: Array.from(selectedItems),
          paymentMethodId: selectedPaymentMethod,
        },
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === "200") {
        router.push("/transaction/my-transaction");
      } else {
        console.error("Error creating transaction:", response.data.message);
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
    } finally {
      setCreatingTransaction(false);
    }
  };

  useEffect(() => {
    fetchCartData();
    fetchPaymentMethods();
  }, []);

  // Calculate total price for selected items
  const totalPrice = cartItems
    .filter((item) => selectedItems.has(item.id))
    .reduce(
      (total, item) => total + item.activity.price_discount * item.quantity,
      0
    );

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
    <div className="min-h-screen text-black bg-gray-50 md:pt-16">
      <Navbar />
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold">Your Cart</h1>
              <span className="px-2 py-1 text-sm text-blue-600 bg-blue-100 rounded-full">
                {cartItems.length} items
              </span>
            </div>
            <button
              onClick={() => router.push("/activity")}
              className="px-4 py-2 text-sm font-medium text-blue-600 transition-colors rounded-full bg-blue-50 hover:bg-blue-100"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      <div className="container p-4 mx-auto mt-4">
        {cartItems.length === 0 ? (
          <div className="max-w-md p-8 mx-auto bg-white rounded-lg shadow-sm">
            <div className="flex flex-col items-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
              <p className="mt-4 text-lg">Your cart is empty</p>
              <button
                onClick={() => router.push("/activity")}
                className="px-6 py-2 mt-4 text-sm font-medium text-white transition-colors bg-blue-600 rounded-full hover:bg-blue-700"
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="overflow-hidden bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedItems.size === cartItems.length}
                          onChange={toggleAllItems}
                          className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm font-medium">Select All</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="divide-y">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-4">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={() => toggleItemSelection(item.id)}
                          className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <img
                          src={item.activity.imageUrls[0]}
                          alt={item.activity.title}
                          className="object-cover w-20 h-20 rounded-lg"
                        />
                        <div className="flex-grow">
                          <h3 className="font-medium">{item.activity.title}</h3>
                          <p className="mt-1 text-sm">
                            Rp {item.activity.price_discount}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              className="p-1 text-gray-500 transition-colors rounded-full hover:bg-gray-100"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              readOnly
                              className="w-12 text-center border rounded"
                            />
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              className="p-1 text-gray-500 transition-colors rounded-full hover:bg-gray-100"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            Rp {item.activity.price_discount * item.quantity}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 mt-2 text-red-500 transition-colors rounded-full hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky p-6 bg-white rounded-lg shadow-sm top-24">
                <div className="pb-4 border-b">
                  <h2 className="text-lg font-semibold">Order Summary</h2>
                </div>
                <div className="pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Selected Items:</span>
                    <span>{selectedItems.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Price:</span>
                    <span className="text-lg font-semibold">
                      Rp {totalPrice}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="paymentMethod" className="text-gray-600">
                      Payment Method:
                    </label>
                    <select
                      id="paymentMethod"
                      value={selectedPaymentMethod || ""}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="px-4 py-2 border rounded-lg"
                    >
                      <option value="">Select Payment Method</option>
                      {paymentMethods.map((method) => (
                        <option key={method.id} value={method.id}>
                          {method.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    disabled={
                      selectedItems.size === 0 ||
                      !selectedPaymentMethod ||
                      creatingTransaction
                    }
                    onClick={handleCheckout}
                    className="flex items-center justify-center w-full gap-2 px-4 py-2 mt-4 text-sm font-medium text-white transition-colors bg-blue-600 rounded-full disabled:bg-gray-400 hover:bg-blue-700"
                  >
                    {creatingTransaction ? (
                      <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Checkout ({selectedItems.size} items)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
