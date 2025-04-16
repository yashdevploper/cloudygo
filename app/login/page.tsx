"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import ThemeToggle from "@/components/appComponents/ThemeToggle";
import { useTheme } from "@/context/themeProvider";

interface ErrorResponse {
  error?: string;
  message?: string;
}

const LoginPage = () => {
  const router = useRouter();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (formData.password.length < 6) {
        setErrorMessage("Password must be at least 6 characters!");
        return toast.error("Password must be at least 6 characters!");
      }
      setIsLoading(true);

      const response = await axios.post("/api/user/login", formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        setFormData({
          email: "",
          password: "",
        });
        setIsLoading(false);
        router.push("/weatherDashboard");
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ErrorResponse>;
      const message =
        axiosError.response?.data?.error ||
        axiosError.response?.data?.message ||
        "login failed. Please try again.";

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const emailNotVerified = "The Email is not verified";

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        theme === "Dark"
          ? "bg-gradient-to-br from-gray-900 to-black"
          : "bg-light-gradient"
      }`}
    >
      {/* Theme Toggle - Positioned at the top right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full space-y-8 ">
        {/* Logo/Header Section */}
        <div className="text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            CloudyGo
          </h1>
          <h2
            className={`text-xl ${
              theme === "Dark" ? "text-gray-300" : "text-gray-500"
            }`}
          >
            Welcome Back
          </h2>
        </div>

        {/* Login Form Container */}
        <div
          className={`${
            theme === "Dark" ? "bg-gray-900/50 " : "bg-slate-200"
          } backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700/30`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className={`block ${
                  theme === "Dark" ? "text-gray-300" : "text-gray-500"
                } text-sm font-medium mb-2`}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={onChange}
                className={`w-full px-4 py-3 ${
                  theme === "Dark"
                    ? "bg-gray-800/50 text-white"
                    : "bg-white text-black"
                } border ${
                  errorMessage.includes("Email")
                    ? "border-red-500"
                    : "border-none"
                } rounded-xl focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent      transition-all duration-200 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className={`block ${
                  theme === "Dark" ? "text-gray-300" : "text-gray-500"
                } text-sm font-medium mb-2`}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={onChange}
                disabled={isLoading}
                className={`w-full px-4 py-3 ${
                  theme === "Dark"
                    ? "bg-gray-800/50 text-white"
                    : "bg-white text-black"
                } border ${
                  errorMessage
                    ? errorMessage === emailNotVerified
                      ? ""
                      : "border-red-500"
                    : "border-none"
                } rounded-xl focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all duration-200 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                placeholder="Enter your password"
              />
              {errorMessage && (
                <p className="mt-2 text-red-500 text-sm">{errorMessage}</p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-400 
                        text-black rounded-xl cursor-pointer hover:opacity-90 transition-all 
                        duration-300 font-semibold text-lg shadow-lg hover:shadow-cyan-400/20"
              disabled={isLoading}
            >
              {isLoading ? "Logging In..." : "Log In"}
            </button>
          </form>
        </div>

        {/* Signup Link */}
        <p className="text-center text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity duration-200"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
