import React, { useState } from "react";
import { ImCross } from "react-icons/im";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const PreviewProfileImage = ({ selectedImage, onClose, imageFile }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
    const navigate = useNavigate();
  const handleUpload = async () => {
    if (!imageFile) {
      setMessage("Please select a file first!");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "mt01project");
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/myhunger/image/upload`,
        formData
      );

      
      console.log(response);
      console.log(response.data.url);
      console.log(response.data.secure_url);
      const imageUrl = response.data.secure_url;
      const res = await axios.post(
        "http://localhost:8081/user/setProfileimage",
        {"imageUrl":imageUrl},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

     

      // Show success message
      setMessage("Image uploaded successfully!");
      navigate("/profile");
      window.location.reload();
    } catch (error) {
      console.error("Upload Error:", error);
      setMessage("File upload failed!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseMessage = () => {
    setMessage("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white pb-10 pt-2 px-8 rounded shadow-lg text-center relative w-[600px] h-[80vh] flex flex-col items-center justify-between">
        <div className="flex justify-end items-center w-full h-[10%]">
          <ImCross className="cursor-pointer" onClick={onClose} />
        </div>
        <div className="w-[80%] h-[350px] border-4 border-blue-400 p-4">
          <img
            className="w-full h-full"
            src={selectedImage}
            alt="profileImage"
          />
        </div>
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upload
        </button>
        {/* Loader */}
        {isLoading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <span className="loading loading-bars loading-lg text-yellow-500"></span>
          </div>
        )}
      </div>

      {/* Pop-up Message */}
      {message && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-white px-6 py-4 rounded shadow-lg text-center">
            <p className="text-lg font-semibold mb-4">{message}</p>
            <button
              onClick={handleCloseMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewProfileImage;
