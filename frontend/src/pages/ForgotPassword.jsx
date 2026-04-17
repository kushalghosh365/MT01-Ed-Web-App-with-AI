import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Otpverication from '../components/OtpVerification.jsx';
import SetNewPassword from './SetNewPassword.jsx';
const ForgotPassword = () => {
    const [email, setEmail] = useState(""); 
    const [isOtpgenerated, setIsOtpgenerated] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoding] = useState(false);
    const [showPopup, setShowPopup] = useState(false); // Popup state
    const [isOtpverified, setIsotpverified] = useState(false);
    const navigate = useNavigate();

    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const handleFormSubmit = async (event) => {
      event.preventDefault();

      if (!email) {
        setError("Email is required.");
        setMessage("");
        setShowPopup(true);
        return;
      }

      if (!isValidEmail(email)) {
        setError("Please enter a valid email address.");
        setMessage("");
        setShowPopup(true);
        return;
      }

      try {
        setIsOtpgenerated(true);
        const response = await axios.post("http://localhost:8081/forgotpassword/generate-otp", { "email": email });
        console.log(response);
        if (response.status === 200) {
          setMessage("OTP has been successfully sent to your email.");
          setShowPopup(true);
          setTimeout(() => {
            setMessage("");
            setError("");
            setShowPopup(false); // Reset popup after OTP verification
            
          }, 1000); // Short delay for user to read the message
        } else {
          throw new Error("OTP generation failed");
        }
      } catch (err) {
        console.log(err.response.data)
        setError( err?.response?.data || "Failed to connect to the server. Please try again later.");
        setMessage("");
        setShowPopup(true);
      } finally {
        setIsLoding(false);
      }
    };

    return (
      <div>
        {/* Popup Notification */}
        {showPopup && (
          <div
            className={`fixed top-4 right-4 w-[300px] p-4 rounded-lg shadow-lg ${
              error ? "bg-red-500 text-white" : "bg-green-500 text-white"
            } transition-transform duration-300`}
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

        {!isOtpgenerated ? (
          <div className="w-full h-[100vh] flex justify-center items-center bg-gray-800">
            <div className="mx-auto max-w-md">
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="p-4 sm:p-7">
                  <div className="text-center">
                    {!isLoading ? (
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
                    ) : (
                      <span className="loading loading-bars loading-lg text-yellow-500"></span>
                    )}
                    <h1 className="block text-2xl font-bold text-gray-800">
                      Forgot password?
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                      Don't worry, we'll send you reset instructions.
                    </p>
                  </div>

                  <div className="mt-6">
                    <form>
                      <div className="grid gap-y-4">
                        <div>
                          <label
                            htmlFor="email"
                            className="mb-2 block text-sm text-gray-600"
                          >
                            Email address
                          </label>
                          <div className="relative">
                            <input
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              type="email"
                              id="email"
                              name="email"
                              className="peer block w-full rounded-md border border-gray-200 bg-gray-50 py-3 px-4 text-sm outline-none ring-offset-1 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
                              aria-describedby="email-error"
                            />
                            <div className="pointer-events-none absolute top-3 right-0 hidden items-center px-3 peer-invalid:flex">
                              <svg
                                className="h-5 w-5 text-rose-500"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                                aria-hidden="true"
                              >
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                              </svg>
                            </div>
                            <p
                              className="mt-2 hidden text-xs text-rose-600 peer-invalid:block"
                              id="email-error"
                            >
                              Valid email address required for the account
                              recovery process
                            </p>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-blue-500 py-3 px-4 text-sm font-semibold text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          onClick={handleFormSubmit}
                        >
                          Reset password
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
                    to={"/login"}
                  >
                    {" "}
                    Sign in here{" "}
                  </Link>
                </span>
                <a
                  className="pl-3 text-sm text-gray-600 decoration-2 hover:text-blue-600 hover:underline"
                  href="#"
                  target="_blank"
                >
                  {" "}
                  Contact Support{" "}
                </a>
              </p>
            </div>
          </div>
        ) :  !isOtpverified ? (
          <Otpverication email={email} onOtpVerified={() => setIsotpverified(true)}/>
        ) : (<SetNewPassword email={email}/>)}
      </div>
    );
};

export default ForgotPassword;
