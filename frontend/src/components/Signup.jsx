import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [checked, setChecked] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [showModal, setShowModal] = useState(false); // State for modal visibility

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    // Validation logic
    if (id === "email") {
      setErrors({
        ...errors,
        email: validateEmail(value) ? "" : "Invalid email format",
      });
    }
    if (id === "password") {
      setErrors({
        ...errors,
        password: validatePassword(value)
          ? ""
          : "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character",
      });
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChecked = () => {
    setChecked(!checked);
  };

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true); // Show confirmation modal on form submit
  };

  const confirmSubmit = async () => {
    try {
      console.log(formData);
      const response = await axios.post(
        "http://localhost:8081/user/signup",
        formData
      );
      console.log("Signup successful:", response.data);
      localStorage.setItem("token", response.data);
      navigate("/");
    } catch (error) {
      console.error("Error during signup:", error);
    }
    setShowModal(false); // Close modal after confirmation
  };

  const cancelSubmit = () => {
    setShowModal(false); // Close modal on cancellation
  };

  const isFormValid = () =>
    formData.name &&
    validateEmail(formData.email) &&
    validatePassword(formData.password) &&
    checked;

  return (
    <div className="flex w-screen flex-wrap text-slate-800">
      <div className="relative hidden h-screen select-none flex-col justify-center bg-blue-600 text-center md:flex md:w-1/2">
        <h1 className="w-full h-full text-center justify-center items-center flex text-[100px] text-white">
          MT01
        </h1>
      </div>
      <div className="flex w-full flex-col md:w-1/2">
        <div className="flex justify-center pt-12 md:justify-start md:pl-12">
          <a href="#" className="text-2xl font-bold text-blue-600">
            MT01
          </a>
        </div>
        <div className="my-auto mx-auto flex flex-col justify-center px-6 pt-8 md:justify-start lg:w-[28rem]">
          <p className="text-center text-3xl font-bold md:text-left md:leading-tight">
            Create your free account
          </p>
          <p className="mt-6 text-center font-medium md:text-left">
            Already using MT01?
            <Link
              to={"/login"}
              className="whitespace-nowrap font-semibold text-blue-700"
            >
              Login here
            </Link>
          </p>
          <form
            className="flex flex-col items-stretch pt-3 md:pt-8"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col pt-4">
              <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                  placeholder="Name"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col pt-4">
              <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                  placeholder="Email"
                  required
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div className="mb-4 flex flex-col pt-4">
              <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                  placeholder="Password (minimum 8 characters)"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <div className="block">
              <input
                className="mr-2 h-5 w-5 appearance-none rounded border border-gray-300 bg-contain bg-no-repeat align-top text-black shadow checked:bg-blue-600 focus:border-blue-600 focus:shadow"
                type="checkbox"
                id="remember-me"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 10l3 3l6-6'/%3e%3c/svg%3e")`,
                }}
                onClick={handleChecked}
              />
              <label className="inline-block" htmlFor="remember-me">
                I agree to the{" "}
                <a className="underline" href="#">
                  Terms and Conditions
                </a>
              </label>
            </div>
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`mt-6 rounded-lg px-4 py-2 text-center text-base font-semibold shadow-md outline-none ring-blue-500 ring-offset-2 transition ${
                isFormValid()
                  ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2"
                  : "bg-gray-400 text-white cursor-not-allowed"
              }`}
            >
              Sign up
            </button>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to sign up?
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelSubmit}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
