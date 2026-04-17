import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SetNewPassword = ({ email }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility
  const navigate = useNavigate();

  const isStrongPassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    // Basic validations before making the request
    if (!password || !confirmPassword) {
      setError("Both password fields are required.");
      setMessage("");
      setShowPopup(true);
      return;
    }

    if (!isStrongPassword(password)) {
      setError(
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character."
      );
      setMessage("");
      setShowPopup(true);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setMessage("");
      setShowPopup(true);
      return;
    }

    try {
      setIsLoading(true);

      // Send email and password in the POST request
      const res = await axios.post("http://localhost:8081/forgotpassword/updatepassword", {
        email: email,
        password: password,
      });

      if (res.status === 200) {
        setMessage("Password has been successfully reset. Redirecting to login...");
        setError("");
        setShowPopup(true);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError("Password reset failed.");
        setMessage("");
        setShowPopup(true);
      }
    } catch (err) {
      setError(err?.response?.data || "Failed to connect to the server. Please try again later.");
      setMessage("");
      setShowPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {showPopup && (
        <div
          className={`fixed top-4 right-4 w-[300px] p-4 rounded-lg shadow-lg ${error ? "bg-red-500 text-white" : "bg-green-500 text-white"} transition-transform duration-300`}
        >
          <p>{error || message}</p>
          <button
            className="absolute top-2 right-2 text-xl font-bold"
            onClick={() => setShowPopup(false)}
          >
            &times;
          </button>
        </div>
      )}

      <div className="w-full h-[100vh] flex justify-center items-center bg-gray-800">
        <div className="mx-auto max-w-md">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="p-4 sm:p-7">
              <div className="text-center">
                {isLoading ? (
                  <span className="loading loading-bars loading-lg text-yellow-500"></span>
                ) : (
                  <div className="mb-4 inline-block rounded-full bg-blue-200 p-2 text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                  </div>
                )}
                <h1 className="block text-2xl font-bold text-gray-800">
                  Set a New Password
                </h1>
              </div>

              <div className="mt-6">
                <form onSubmit={handleResetPassword}>
                  <div className="grid gap-y-4">
                    <div>
                      <label
                        htmlFor="password"
                        className="mb-2 block text-sm text-gray-600"
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          type={showPassword ? "text" : "password"} // Toggle password visibility
                          id="password"
                          name="password"
                          className="block w-full rounded-md border border-gray-200 bg-gray-50 py-3 px-4 text-sm outline-none ring-offset-1 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          className="absolute top-3 right-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="mb-2 block text-sm text-gray-600"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          type={showConfirmPassword ? "text" : "password"} // Toggle confirm password visibility
                          id="confirmPassword"
                          name="confirmPassword"
                          className="block w-full rounded-md border border-gray-200 bg-gray-50 py-3 px-4 text-sm outline-none ring-offset-1 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          className="absolute top-3 right-3"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-blue-500 py-3 px-4 text-sm font-semibold text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Reset Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <p className="mt-3 flex items-center justify-center divide-x divide-gray-300 text-center">
            <span className="inline pr-3 text-sm text-gray-600">
              Remember your password?
              <Link
                className="font-medium text-blue-600 decoration-2 hover:underline"
                to="/login"
              >
                Sign in here
              </Link>
            </span>
            <a
              className="pl-3 text-sm text-gray-600 decoration-2 hover:text-blue-600 hover:underline"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetNewPassword;
