import React, { useState } from "react";
import { FaLink } from "react-icons/fa";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaUserCircle,
  FaCode,
  FaHackerrank,
  FaFacebook,
  FaInstagram,
  FaMedium,
} from "react-icons/fa";
import { FaX } from "react-icons/fa6";

const AddLinks = ({ onClose, onSave }) => {
  const [links, setLinks] = useState([{ platform: "", link: "" }]);

  const platformOptions = [
    { id: 1, name: "GitHub", icon: <FaGithub /> },
    { id: 2, name: "LinkedIn", icon: <FaLinkedin color="blue"/> },
    { id: 3, name: "Twitter", icon: <FaTwitter color="gray"/> },
    { id: 4, name: "Portfolio", icon: <FaUserCircle /> },
    { id: 5, name: "Leetcode",icon: <FaLink /> },
    { id: 6, name: "CodeChef",icon: <FaLink /> },
    { id: 7, name: "HackerRank",icon: <FaLink /> },
    { id: 8, name: "CodeForces", icon: <FaCode /> },
    { id: 9, name: "Facebook", icon: <FaFacebook color="blue"/> },
    { id: 10, name: "Instagram", icon: <FaInstagram color="deep-pink"/> },
    { id: 11, name: "GeeksForGeeks",icon: <FaLink />  },
    { id: 12, name: "CodingNinjas",icon: <FaLink /> },
    { id: 13, name: "Medium", icon: <FaMedium /> },
    { id: 14, name: "AtCoder",icon: <FaLink/> },
  ];

  const handleChange = (index, field, value) => {
    const updatedLinks = [...links];
    updatedLinks[index][field] = value;
    setLinks(updatedLinks);
  };

  const handleAddLink = () => {
    setLinks([...links, { platform: "", link: "" }]);
  };

  const handleRemoveLink = (index) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
   
    onSave(links);
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50  flex justify-center items-end min-h-[220vh] z-99">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-lg z-99 mb-48">
        <h2 className="text-lg font-bold mb-4">Add Your Links</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {links.map((link, index) => (
            <div key={index} className="space-y-2">
              <div>
                <label className="block text-sm font-medium">Platform</label>
                <select
                  name={`platform-${index}`}
                  value={link.platform}
                  onChange={(e) => handleChange(index, "platform", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="" disabled>
                    Select Platform
                  </option>
                  {platformOptions.map((option) => (
                    <option key={option.id} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                {link.platform && (
                  <span className="text-xl">
                    {platformOptions.find((opt) => opt.name === link.platform)?.icon}
                  </span>
                )}
                <label className="block text-sm font-medium">Link</label>
              </div>
              <input
                type="url"
                name={`link-${index}`}
                value={link.link}
                onChange={(e) => handleChange(index, "link", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="e.g., https://github.com/username"
                required
              />
              <div className="flex justify-end">
                {links.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          <div>
            <button
              type="button"
              onClick={handleAddLink}
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              Add Another Link
            </button>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLinks;
