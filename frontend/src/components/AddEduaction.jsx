import React, { useState } from "react";

const AddEducation = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    organizationName: "",
    degree: "",
    department: "",
    startDate: "",
    endDate: "",
    location: "",
    scoreType: "",
    score: "",
    scoreType: "", // New field to capture the selected score type
    description: "",
  });
  const [selectedType, setSelectedType] = useState("");

  const options = [
    { id: 1, name: "GPA" },
    { id: 2, name: "CGPA" },
    { id: 3, name: "PERCENTAGE" },
  ];

  const handleSelectChange = (e) => {
    const selectedOption = options.find(
      (option) => option.id === parseInt(e.target.value)
    );
    if (selectedOption) {
      // Update formData with the name of the selected option
      setFormData((prevState) => ({
        ...prevState,
        scoreType: selectedOption.name, // Set the name (value) of the selected option
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    console.log(formData);
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-start h-[200vh] z-99">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-lg z-99 mt-32">
        <h2 className="text-lg font-bold mb-4">Add Your Education</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">
              Organization Name
            </label>
            <input
              type="text"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Degree</label>
            <input
              type="text"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Score Type</label>
            <select
              name="scoreType"
              value={formData.scoreType} // Use formData to control the value
              onChange={handleSelectChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="" disabled>
                Select Score Type
              </option>
              {options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Score</label>
            <input
              type="text"
              name="score"
              value={formData.score}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              rows="4"
            ></textarea>
          </div>
          <div className="flex justify-end gap-3">
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

export default AddEducation;
