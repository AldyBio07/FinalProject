import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { setCookie } from "cookies-next";

const Login = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();

    const payload = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    const url =
      "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/login";
    const config = {
      headers: {
        apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
      },
    };

    axios
      .post(url, payload, config)
      .then((res) => {
        setCookie("token", res.data.token);
        router.push("/");
      })
      .catch((err) => {
        setErrorMessage(err.response.data.message);
      });

    const token = "user-auth-token";
    setCookie("token", token, { path: "/" });
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-900 bg-center bg-no-repeat bg-cover"
      style={{ backgroundImage: "url('/path-to-food-background.jpg')" }}
    >
      <div className="w-full max-w-md p-8 bg-black rounded-lg shadow-lg bg-opacity-70">
        <h1 className="text-4xl font-bold text-center text-[#FF6500]">Login</h1>

        <form
          onSubmit={handleLogin}
          className="flex flex-col items-center justify-center gap-4"
        >
          {errorMessage && (
            <div className="p-2 mb-4 text-red-500 bg-red-200 rounded-md">
              {errorMessage}
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
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
