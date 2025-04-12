"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";

const signupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordError("");

    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (formData.password !== confirmPassword) {
        setPasswordError("Passwords do not match!");
        return toast.error("Passwords do not match!");
      }

      setIsLoading(true);

      if (formData.password.length < 6) {
        setPasswordError("Password must be at least 6 characters!");
        return toast.error("Password must be at least 6 characters!");
      }

      setIsLoading(true);

      const response = await axios.post("/api/user/signup", formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        toast.success("Registration successful! Please check your email.");
        setPasswordError("");
        setSignupSuccess(true);
        setFormData({ username: "", email: "", password: "" });
        setConfirmPassword("");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Registration failed. Please try again.";

      setPasswordError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Header Section */}
        <div className="text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            CloudyGo
          </h1>
          <h2 className="text-xl text-gray-300">Create an Account</h2>
        </div>

        {/* Signup Form Container */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700/30">
          {signupSuccess ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100/10 backdrop-blur-sm border border-green-500/30 mb-4">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Registration Successful!
              </h3>
              <p className="text-gray-300 mb-6">
                We've sent a verification email to your inbox. Please check your
                email to complete the verification process.
              </p>
              <button
                onClick={() => setSignupSuccess(false)}
                className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-400 
                text-black rounded-xl cursor-pointer hover:opacity-90 transition-all 
                duration-300 font-semibold shadow-lg hover:shadow-cyan-400/20"
              >
                Register Another Account
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-gray-300 text-sm font-medium mb-2"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent text-white transition-all duration-200 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  placeholder="Enter your username"
                />
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-300 text-sm font-medium mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`${
                    passwordError === "Email already exists"
                      ? "border-red-500"
                      : ""
                  } w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent text-white transition-all duration-200 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  placeholder="Enter your email"
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-300 text-sm font-medium mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 bg-gray-800/50 border ${
                    passwordError === "Passwords do not match!"
                      ? "border-red-500"
                      : "border-gray-700"
                  } rounded-xl focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent text-white transition-all duration-200 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  placeholder="Create a password"
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-300 text-sm font-medium mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 bg-gray-800/50 border ${
                    passwordError === "Passwords do not match!"
                      ? "border-red-500"
                      : "border-gray-700"
                  } rounded-xl focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent text-white transition-all duration-200 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  placeholder="Confirm your password"
                />
                {passwordError && (
                  <p className="mt-2 text-red-500 text-sm">{passwordError}</p>
                )}
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-400 
                          text-black rounded-xl cursor-pointer hover:opacity-90 transition-all 
                          duration-300 font-semibold text-lg shadow-lg hover:shadow-cyan-400/20"
                disabled={isLoading}
              >
                {isLoading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
          )}
        </div>

        {/* Login Link */}
        <p className="text-center text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity duration-200"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default signupPage;
