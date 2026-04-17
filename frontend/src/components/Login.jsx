import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState(""); // to determine if the message is success or error
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8081/user/signin", formData);
      console.log("Signin successful:", res.data);
      localStorage.setItem("token", res.data);
      setPopupMessage("Login successful!");
      setPopupType("success");
      setShowPopup(true);
      setTimeout(() => {
        navigate("/");
      }, 2000); // Redirect after showing pop-up for 2 seconds
    } catch (e) {
      console.log("Login error", e);
      if(e.code=="ERR_NETWORK") 
        setPopupMessage("Internal Server Error");
      else setPopupMessage("Invalid email or password.");
      setPopupType("error");
      setShowPopup(true);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-800 h-[100vh]">
      {/* Pop-up */}
      {showPopup && (
        <div
          className={`fixed top-4 right-4 w-[300px] p-4 rounded-lg shadow-lg ${
            popupType === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
          } transition-transform duration-300`}
        >
          <p>{popupMessage}</p>
          <button
            className="absolute top-2 right-2 text-xl font-bold"
            onClick={() => setShowPopup(false)}
          >
            &times;
          </button>
        </div>
      )}

      <div className="flex flex-col justify-center px-6 py-12 lg:px-8 w-[40%] h-[80%] bg-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="flex justify-center items-center text-[35px] text-indigo-500">
            MT01
          </h2>
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <Link
                    to={"/forgotpassword"}
                    className="font-semibold text-gray-900 "
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  onChange={handleChange}
                  value={formData.password}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Not a member?
            <Link
              to={"/signup"}
              className="font-semibold text-gray-900 hover:text-indigo-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
