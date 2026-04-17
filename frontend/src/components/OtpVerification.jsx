import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Otpverication = ({ email, onOtpVerified  }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoding] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [timer, setTimer] = useState(60); // Timer state
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const navigate = useNavigate();

  // Timer logic
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval); // Cleanup interval
    } else {
      setIsResendDisabled(false); // Enable the resend button when timer ends
    }
  }, [timer]);

  const handleChange = (value, index, event) => {
    const newOtp = [...otp];
    const key = event.key;

    if (/^\d$/.test(value)) {
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    } else if (key === "Backspace") {
      newOtp[index] = "";
      setOtp(newOtp);
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    } else if (key === "ArrowRight") {
      if (index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    } else if (key === "ArrowLeft") {
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoding(true);
      const fullOtp = otp.join("");

      if (otp.some((digit) => digit === "")) {
        setError("Please fill in all 4 digits of the OTP.");
        setMessage("");
        setShowPopup(true);
        return;
      }

      if (fullOtp.length !== 4 || !/^\d{4}$/.test(fullOtp)) {
        setError("Please enter a valid 4-digit OTP.");
        setMessage("");
        setShowPopup(true);
        return;
      }

      const response = await axios.post("http://localhost:8081/forgotpassword/validate-otp", {
        otp: fullOtp,
        email: email,
      });

      if (response?.status === 200) {
        setMessage("OTP Verified!");
        setShowPopup(true);
        setTimeout(() => {
          setMessage("");
          setError("");
          setShowPopup(false); // Reset popup after OTP verification
          onOtpVerified(); // Trigger next step
        }, 1000); // Short delay for user to read the message
      }
    } catch (err) {
      setError(err?.response?.data);
      setMessage("");
      setShowPopup(true);
    } finally {
      setIsLoding(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsResendDisabled(true); // Reset the timer
      setMessage("Resending OTP...");
      setShowPopup(true);

      const response = await axios.post("http://localhost:8081/forgotpassword/generate-otp", {
        "email": email,
      });

      if (response.status === 200) {
        setMessage("OTP Resent Successfully!");
        setTimer(60);
        setError("");
      }
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setShowPopup(true);
    }
  };

  return (
    <div className="w-full h-[100vh] flex justify-center items-center bg-gray-800 relative">
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

      <div className="mx-auto max-w-md">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              {isLoading === false ? (
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
                <span className="loading loading-bars loading-lg"></span>
              )}
              <h1 className="block text-2xl font-bold text-gray-800">
                Verify Your OTP
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                We have sent a code to your given email
              </p>
            </div>

            <div className="mt-6">
              <form>
                <div className="grid gap-y-4">
                  <div>
                    <div className="flex justify-center gap-2 mb-4">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength="1"
                          required
                          value={digit}
                          onChange={(e) => handleChange(e.target.value, index, e.nativeEvent)}
                          onKeyDown={(e) => handleChange("", index, e)}
                          className="w-12 h-12 text-center text-lg font-bold rounded-md border border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-blue-500 py-3 px-4 text-sm font-semibold text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={handleOtpSubmit}
                  >
                    Submit OTP
                  </button>
                </div>
              </form>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Resend OTP in:{" "}
                  <span className="font-bold text-blue-500">{timer}s</span>
                </p>
                <button
                  onClick={handleResendOtp}
                  disabled={isResendDisabled}
                  className={`mt-2 rounded-md py-2 px-4 text-sm font-semibold text-white ${
                    isResendDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  Resend OTP
                </button>
              </div>
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
  );
};

export default Otpverication;
