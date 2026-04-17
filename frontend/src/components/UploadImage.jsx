import React, { useRef, useState } from "react";
import { ImCross } from "react-icons/im";
import PreviewProfileImage from "./PreviewProfileImage";
import axios from 'axios';

const UploadImage = ({ imageUpload, onClose }) => {
  const [imageFile, setImageFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Programmatically click the hidden input
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB.");
        setSelectedImage(null);
        setImageFile(null);
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed.");
        return;
      }

      setImageFile(file); // Store the actual file for upload
      setSelectedImage(URL.createObjectURL(file)); // Create a preview URL
      setError(""); // Clear any previous errors
    }

    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      setImageFile(compressedFile);
    } catch (error) {
      console.error("Error compressing file:", error);
    }
  };

  const handlePreviewImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white pb-10 pt-2 px-8 rounded shadow-lg text-center relative w-[600px] h-[200px] flex flex-col items-center justify-between ">
        <div className="w-[100%] h-[30%] p-1 flex justify-between items-center border-b border-1 border-gray-200">
          <h1>Upload</h1>
          <ImCross className="cursor-pointer" onClick={onClose} />
        </div>
        <div className="w-[100%] h-[30%] py-8 flex flex-col text-sm justify-center items-center gap-2">
          <p>Max file size: 5.00 MB</p>
          <p>(image/* are supported)</p>
          <button
            onClick={handleButtonClick}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Upload
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </button>
        </div>
      </div>
      {selectedImage && (
        <PreviewProfileImage
          selectedImage={selectedImage}
          onClose={handlePreviewImage}
          imageFile={imageFile}
        />
      )}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
          {error}
          <ImCross
            className="ml-2 inline cursor-pointer"
            onClick={() => setError("")}
          />
        </div>
      )}
    </div>
  );
};

export default UploadImage;
