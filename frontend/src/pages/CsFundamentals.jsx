import React from "react";
import jsImage from "../assets/js.png";
import Navbar from "../components/Navbar";

const CsFundamentals = () => {
  const pdfFiles = [
    { name: "PDF 1", url: "/path/to/pdf1.pdf", image: jsImage },
    { name: "PDF 2", url: "/path/to/pdf2.pdf", image: "/path/to/image2.jpg" },
    { name: "PDF 3", url: "/path/to/pdf3.pdf", image: "/path/to/image3.jpg" },
    { name: "PDF 4", url: "/path/to/pdf4.pdf", image: "/path/to/image4.jpg" },
    { name: "PDF 5", url: "/path/to/pdf5.pdf", image: "/path/to/image5.jpg" },
    { name: "PDF 6", url: "/path/to/pdf6.pdf", image: "/path/to/image6.jpg" },
    { name: "PDF 7", url: "/path/to/pdf7.pdf", image: "/path/to/image7.jpg" },
    { name: "PDF 8", url: "/path/to/pdf8.pdf", image: "/path/to/image8.jpg" },
    { name: "PDF 9", url: "/path/to/pdf9.pdf", image: "/path/to/image9.jpg" },
  ];

  const openPdf = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-[84vh] bg-gray-100 flex items-center justify-center">
        <div className="w-[80%] overflow-x-auto">
          <div className="flex gap-x-4 p-4"> {/* Added gap-x-4 to create space between the cards */}
            {pdfFiles.map((pdf, index) => (
              <button
                key={index}
                onClick={() => openPdf(pdf.url)}
                className="w-[400px] h-48 bg-cover bg-center rounded-lg flex items-center justify-center text-center hover:bg-opacity-80 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 bg-gray-900 focus:ring-indigo-500"
                style={{ backgroundImage: `url(${pdf.image})` }}  // Dynamically setting the background image
              >
                {/* Optionally, you can add a label inside the button */}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CsFundamentals;
