"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const token = searchParams.get("token");

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const verifyEmail = async () => {
    if (!token) return;

    setIsVerifying(true);

    try {
      const response = await axios.post(
        "/api/user/verifyEmail",
        { token },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        setVerificationSuccess(true);
      } else {
        setVerificationError(
          response.data.message || "Verification failed. Please try again."
        );
      }
    } catch (error) {
      setVerificationError("An error occurred during verification");
      console.error("Verification error:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    // Resend verification email logic would go here
    setCountdown(30);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Header Section */}
        <div className="text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            CloudyGo
          </h1>
          <h2 className="text-xl text-gray-300">
            {verificationSuccess ? "Email Verified" : "Verify Your Email"}
          </h2>
        </div>

        {/* Verification Container */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700/30">
          {verificationSuccess ? (
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
              <h3 className="text-xl font-semibold text-white mb-4">
                Email Verification Successful!
              </h3>
              <p className="text-gray-300 mb-6">
                Your email has been successfully verified. You can now log in to
                your account.
              </p>
              <Link href="/login">
                <button
                  className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-400 
                  text-black rounded-xl cursor-pointer hover:opacity-90 transition-all 
                  duration-300 font-semibold text-lg shadow-lg hover:shadow-cyan-400/20"
                >
                  Go to Login
                </button>
              </Link>
            </div>
          ) : (
            <>
              <p className="text-gray-300 text-center mb-8">
                Click below to verify your email address
              </p>

              {/* Verify Button - Always shown but disabled when no token */}
              <button
                onClick={verifyEmail}
                disabled={isVerifying || !token}
                className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-400 
                        text-black rounded-xl cursor-pointer hover:opacity-90 transition-all 
                        duration-300 font-semibold text-lg shadow-lg hover:shadow-cyan-400/20 disabled:opacity-50"
              >
                {isVerifying ? "Verifying..." : "Verify Email"}
              </button>

              {/* Error Message */}
              {verificationError && (
                <div className="mt-4 text-center">
                  <p className="text-red-500">{verificationError}</p>
                </div>
              )}

              {/* Resend Section */}
              <div className="text-center mt-8">
                <p className="text-gray-300">
                  Need a new verification link?{" "}
                  <button
                    onClick={handleResendVerification}
                    disabled={countdown > 0}
                    className={`bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent 
                              ${
                                countdown > 0
                                  ? "opacity-50 cursor-not-allowed"
                                  : "hover:opacity-80 transition-opacity duration-200"
                              }`}
                  >
                    Resend {countdown > 0 && `(${countdown})`}
                  </button>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Back to Login */}
        {!verificationSuccess && (
          <p className="text-center text-gray-400">
            Return to{" "}
            <Link
              href="/login"
              className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity duration-200"
            >
              Login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
