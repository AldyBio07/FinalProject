import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { setCookie } from "cookies-next";

const Register = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleRegister = (e) => {
    e.preventDefault();

    const payload = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    const url =
      "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/register"; // Update with the actual register endpoint
    const config = {
      headers: {
        apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
      },
    };

    axios
      .post(url, payload, config)
      .then((res) => {
        setCookie("token", res.data.data.token); // Assuming the token is returned upon registration
        setSuccessMessage("Registration successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/login"); // Redirect to login page after registration
        }, 2000);
      })
      .catch((err) => {
        setErrorMessage(err.response.data.message);
      });
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-900 bg-center bg-no-repeat bg-cover"
      style={{ backgroundImage: "url('/path-to-food-background.jpg')" }}
    >
      <div className="w-full max-w-md p-8 bg-black rounded-lg shadow-lg bg-opacity-70">
        <h1 className="text-4xl font-bold text-center text-[#FF6500]">
          Register
        </h1>

        <form
          onSubmit={handleRegister}
          className="flex flex-col items-center justify-center gap-4"
        >
          {errorMessage && (
            <div className="p-2 mb-4 text-red-500 bg-red-200 rounded-md">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="p-2 mb-4 text-green-500 bg-green-200 rounded-md">
              {successMessage}
            </div>
          )}
          <label htmlFor="email" className="w-full text-gray-300">
            Email
            <input
              id="email"
              type="text"
              name="email"
              className="w-full p-2 mt-2 text-black border-2 border-[#FF6500] rounded"
              required
            />
          </label>

          <label htmlFor="password" className="w-full text-gray-300">
            Password
            <input
              id="password"
              type="password"
              name="password"
              className="w-full p-2 mt-2 text-black border-2 border-[#FF6500] rounded"
              required
            />
          </label>

          <button
            type="submit"
            className="w-full p-2 text-white transition duration-300 bg-green-500 rounded hover:bg-green-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
