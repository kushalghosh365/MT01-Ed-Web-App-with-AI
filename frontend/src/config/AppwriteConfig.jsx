import { Client, Storage } from "appwrite";

const client = new Client();
const storage = new Storage(client);

// Initialize Appwrite client
client
  .setEndpoint("https://cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
  .setProject("676068e900120efa478f"); // Replace with your Project ID

  
  const deleteFileFromAppwrite = async (fileId) => {
    try {
      console.log("Attempting to delete file with ID:", fileId);
  
      if (!fileId) {
        throw new Error("File ID is required to delete a file.");
      }
  
      await storage.deleteFile("67606941000dd1640a10", fileId);
      console.log("File successfully deleted from Appwrite:", fileId);
    } catch (error) {
      if (error.response) {
        console.error("Appwrite API error:", error.response);
      } else {
        console.error("Error deleting file from Appwrite:", error.message);
      }
      throw error;
    }
  };
  

export { storage,deleteFileFromAppwrite };
