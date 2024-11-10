import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      // Refetch cart data after updating
      fetchCartData();
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  // Function to handle quantity change
  const handleQuantityChange = (cartId, newQuantity) => {
    if (newQuantity < 1) {
      newQuantity = 1; // Prevent negative or zero quantity
    }
    updateCartQuantity(cartId, newQuantity);
  };

  // Function to remove item from cart
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
      fetchCartData();
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.activity.price_discount * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-32 h-32 border-t-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="mt-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="py-4 text-white bg-blue-600 shadow-md">
        <div className="container flex items-center justify-between px-4 mx-auto">
          <h1 className="text-2xl font-bold">Keranjang Anda</h1>
          <button
            onClick={() => router.push("/activities")}
            className="px-4 py-2 text-blue-600 bg-white rounded-full"
          >
            Lanjutkan Belanja
          </button>
        </div>
      </header>

      <div className="container px-4 mx-auto mt-8">
        {cartItems.length === 0 ? (
          <div className="py-16 text-center">
            <svg
              className="w-24 h-24 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <p className="text-xl text-gray-600">Keranjang Anda kosong</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {/* Daftar Item */}
            <div className="space-y-4 md:col-span-2">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center p-4 bg-white rounded-lg shadow-md"
                >
                  <img
                    src={item.activity.imageUrls[0]}
                    alt={item.activity.title}
                    className="object-cover w-24 h-24 mr-4 rounded-lg"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-black">
                      {item.activity.title}
                    </h3>
                    <p className="text-black">
                      Rp {item.activity.price_discount.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        className="px-2 py-1 bg-gray-200 rounded-l"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        readOnly
                        className="w-16 py-1 text-center border-gray-200 border-y"
                      />
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        className="px-2 py-1 bg-gray-200 rounded-r"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="font-bold">
                      Rp{" "}
                      {(
                        item.activity.price_discount * item.quantity
                      ).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="mt-2 text-red-500 hover:text-red-700"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Ringkasan Pesanan */}
            <div className="p-6 bg-white rounded-lg shadow-md h-fit">
              <h2 className="mb-4 text-xl font-bold">Ringkasan Pesanan</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Harga:</span>
                  <span className="font-bold">
                    Rp {totalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Jumlah Item:</span>
                  <span className="font-bold">{cartItems.length}</span>
                </div>
              </div>
              <button className="w-full py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700">
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
