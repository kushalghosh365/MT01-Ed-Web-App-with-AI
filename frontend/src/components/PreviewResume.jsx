import React, { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { storage,deleteFileFromAppwrite } from "../config/AppwriteConfig.jsx";
const PreviewResume = ({ selectedResume, onClose, resumeFile }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [uploadedFileId, setUploadedFileId] = useState("");
  const bucketId = '67606941000dd1640a10';
  const handleFileUpload = async () => {
    if (!resumeFile) {
      setError("Please select a file first.");
      setUploadMessage("");
      return;
    }
  
    if (resumeFile.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      setUploadMessage("");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User is not authenticated! Please sign in.");
        setUploadMessage("");
        return;
      }
  
      // Check if a resumeId exists in the database
      const userFileResponse = await axios.get(
        "http://localhost:8081/user/getResumeId",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(userFileResponse.data);
      const existingFileId = userFileResponse?.data;
      console.log("eta bol", existingFileId);
      if (existingFileId) {
        try {
          // Delete the existing file from Appwrite
          await deleteFileFromAppwrite(existingFileId);
          console.log("Existing file deleted from Appwrite:", existingFileId);
          
          // Delete the resumeId from the database
          const deleteDbResponse = await axios.post(
            "http://localhost:8081/user/deleteResumeId",{},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          if (deleteDbResponse?.status === 200) {
            console.log("Existing fileId deleted from DB");
          } else {
            throw new Error("Failed to delete resumeId from the database.");
          }
        } catch (deleteError) {
          console.error("Error during deletion process:", deleteError.message);
          setError("Somthing went Wrong! Please Try again");
          setUploadMessage("");
        }
      }
  
      // Upload the new file to Appwrite
      const response = await storage.createFile(bucketId, "unique()", resumeFile);
      console.log("Uploaded File:", response);
  
      if (response.$id) {
        // Save the new file ID to the database
        const saveResponse = await axios.post(
          "http://localhost:8081/user/upload/resume",
          { "resume": response.$id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (saveResponse?.status === 200) {
          setUploadMessage("File uploaded successfully.");
          setError("");
          setUploadedFileId(response.$id);
          navigate("/profile");
          window.location.reload();
        } else {
          throw new Error("Failed to save the new file ID to the database.");
        }
      } else {
        throw new Error("File upload failed.");
      }
    } catch (error) {
      console.error("File upload error:", error.message);
      setUploadMessage("");
      setError(error?.response?.data || "Failed to upload the file. Please try again.");
    }
  };
  
  
 
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded shadow-lg text-center relative w-[600px] h-[84vh] ">
        <ImCross className="cursor-pointer absolute top-2 right-2" onClick={onClose} />
        <p className="mb-4">Preview of the selected resume</p>

        {selectedResume && (
          <iframe
            src={URL.createObjectURL(resumeFile)}
            title="Resume Preview"
            className="w-full h-[60vh] border"
          ></iframe>
        )}

        <button
          onClick={handleFileUpload}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upload
        </button>

        {isLoading && <div>Loading...</div>}

        
      </div>
    </div>
  );
};

export default PreviewResume;
