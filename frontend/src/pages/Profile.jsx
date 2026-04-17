import React, { useEffect, useState } from "react";
import { Tilt } from "react-tilt";
import { HiOutlineMailOpen } from "react-icons/hi";
import { MdCall } from "react-icons/md";
import { FaLocationDot, FaTrash } from "react-icons/fa6";
import axios from "axios";
import Navbar from "../components/Navbar";
import { MdOutlineWork } from "react-icons/md";
import { FaGraduationCap } from "react-icons/fa6";
import { RiLinksLine } from "react-icons/ri";
import { TbCertificate } from "react-icons/tb";
import { FaPlus } from "react-icons/fa6";
import UploadImage from "../components/UploadImage";
import UploadResume from "../components/UploadResume";
import { deleteFileFromAppwrite, storage } from "../config/AppwriteConfig";
import { MdDelete } from "react-icons/md";
import AddExperience from "../components/AddExperience";
import { MdLocationOn } from "react-icons/md";
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import AddEducation from "../components/AddEduaction";
import AddLinks from "../components/AddLinks";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLink,
  FaLinkedin,
  FaMedium,
  FaTwitter,
  FaUserCircle,
} from "react-icons/fa";
import AddCertifications from "../components/AddCertifications";
const Profile = () => {
  const defaultOptions = {
    reverse: false, // reverse the tilt direction
    max: 35, // max tilt rotation (degrees)
    perspective: 1000, // Transform perspective, the lower the more extreme the tilt gets.
    scale: 1.1, // 2 = 200%, 1.5 = 150%, etc..
    speed: 1000, // Speed of the enter/exit transition
    transition: true, // Set a transition on enter/exit.
    axis: null, // What axis should be disabled. Can be X or Y.
    reset: true, // If the tilt effect has to be reset on exit.
    easing: "cubic-bezier(.03,.98,.52,.99)", // Easing on enter/exit.
  };

  useEffect(() => {
    getProfileDetails();
    getResumeId();
    getUserExperiences();
    getUserEducation();
    handleGetLinks();
    getCertificates();
  }, []);

  //image url getting
  const [profileDetails, setProfileDeatils] = useState(null); // [name, imagelink, role]
  const [imageUpload, setImageUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [resumeUpload, setResumeUpload] = useState(false);
  const [resumeId, setResumeId] = useState(null);
  const [skills, setSkills] = useState([]); // Skills array
  const [isAdding, setIsAdding] = useState(false); // Toggle input visibility
  const [newSkill, setNewSkill] = useState(""); // New skill input
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);
  const [isEducationOpen, setIsEducationOpen] = useState(false);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [isLinksOpen, setIsLinkOpen] = useState(false);
  const [links, setLinks] = useState([]);
  const [isCertificationOpened, setIsCertificationOpened] = useState(false);
  const [certificates, setCertificates] = useState([
    { provider: "Wipro", name: "Java Full stack" },
  ]);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const [showAllEducations, setShowAllEducations] = useState(false); // Controls whether all experiences are shown
  const [showAllExperiences, setShowAllExperiences] = useState(false);
  const [showAllLinks, setShowAllLinks] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [message, setMessage] = useState(null);
  const [err, setErr] = useState(null);

  //correct
  const getUserSkills = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/skills/getuserskills",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.status === 200) {
        setSkills(response.data); // Set skills from the backend
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
      setErr(error.data);
    }
  };
  //editable
  useEffect(() => {
    getProfileDetails();
    getUserSkills(); // Fetch skills on component mount
  }, []);

  //correct
  const handleAddSkill = async () => {
    if (newSkill.trim()) {
      try {
        const requestBody = { skillName: newSkill.trim() };
        const response = await axios.post(
          "http://localhost:8081/skills/addSkill",
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response.status);
        if (response.status == 208) alert("Skill already present");
        if (response.status === 200) {
          // Fetch updated skills after adding
          getUserSkills();
          setNewSkill(""); // Clear input field
        } else {
          throw new Error("Skill not added");
        }
      } catch (error) {
        console.error("Error adding skill:", error);
      }
    }
  };

  //correct
  const handleDeleteSkill = async (skillName) => {
    try {
      const response = await axios.post(
        `http://localhost:8081/skills/deleteskills`,
        { skillName: skillName },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.status === 200) {
        // Fetch updated skills after deletion
        getUserSkills();
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
      alert("An error occurred while deleting the skill.");
    }
  };

  //correct
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddSkill(); // Add skill on pressing Enter
    }
  };

  //correct
  const bucketId = "67606941000dd1640a10";
  const getProfileDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8081/user/getProfiledetails",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data != null) {
        console.log(response);
        setProfileDeatils(response.data);
        console.log(response.data[1]);
      } else throw new Error("No profile found");
    } catch (e) {
      console.log("err", e);
    }
  };
  //correct
  const handleResumeUpload = () => {
    setResumeUpload(!resumeUpload);
  };

  //correct
  //resume upload process
  const handleImageUpload = () => {
    setImageUpload(!imageUpload);
  };
  //correct
  const getResumeId = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:8081/user/getResumeId", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setResumeId(res.data);
  };

  // useEffect(() => {
  //   if (resumeId) {
  //     fetchFileById(resumeId)
  //       .then((file) => {
  //         if (file) {
  //           console.log("Fetched File:", file);
  //         }
  //       })
  //       .catch((error) => console.error("Error:", error));
  //   }
  // }, [resumeId]);

  //correct
  const fetchFileById = async (resumeId) => {
    try {
      const file = await storage.getFile(bucketId, resumeId);
      return file;
    } catch (error) {
      console.error("Error fetching file:", error.message);
      return null;
    }
  };

  //correct
  const getFileDownloadURL = (resumeId) => {
    return storage.getFileDownload(bucketId, resumeId);
  };

  //correct
  const handleDeleteFile = async () => {
    try {
      // 1. Delete the file from Appwrite
      // console.log(resumeId);
      await deleteFileFromAppwrite(resumeId);

      // 2. Remove resume ID from the user's backend
      const token = localStorage.getItem("token");
      await axios
        .post(
          "http://localhost:8081/user/deleteResumeId",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          console.log("File successfully deleted", res);
          if (res.status == 200) {
            // console.log("Ha delete hoye gache");
            setResumeId(null);
          }
        })
        .catch((e) => console.log(e));
      // 3. Notify parent component about successful deletion
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };
  // useEffect(() => {
  //   console.log(resumeId);
  // }, [resumeId]);

  //Add Experience

  //correct
  const handleOpenExperience = () => {
    setIsExperienceOpen(true);
  };
  const handleCloseExperience = () => setIsExperienceOpen(false);
  //correct
  const handleSaveExperience = async (formData) => {
    // console.log("saved", formData);
    try {
      const res = await axios.post(
        "http://localhost:8081/experience/addExperience",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status === 200) {
        setMessage("Experience Added Successfully");
        getUserExperiences();
      }
    } catch (e) {
      console.log("exp err", e);
    }
  };
  //correct
  const getUserExperiences = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8081/experience/getExperience",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("chamaila1", res);
      if (res.status === 200) {
        setExperiences(res.data);
      }
    } catch (e) {
      console.log("exp err", e);
    }
  };
  //maxshowing
  const maxVisible = 1; // Number of experiences to show initially

  const displayedExperiences = showAllExperiences
    ? experiences
    : experiences.slice(0, maxVisible);

  //correct
  const deleteExperience = async (index) => {
    try {
      const experienceTobeDelted = experiences[index];
      console.log("haaaaaaahhhhhhhhh", experienceTobeDelted.experienceId);
      const res = await axios.post(
        "http://localhost:8081/experience/deleteExperience",
        {
          experienceId: experienceTobeDelted.experienceId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status === 200) {
        getUserExperiences();
        setMessage("experience deleted successfully");
      }
    } catch (e) {
      console.log("err deleting experience".e);
    }
  };
  // const updateUserExperiences = (index)=>{
  //   try{
  //     const experienceTobeUpdated = experiences[index];

  //   }
  //   catch( e){
  //     console.log("err updating experience", e);
  //   }
  // }

  // add education

  const handleOpenEducation = () => {
    setIsEducationOpen(true);
  };
  const handleCloseEducation = () => setIsEducationOpen(false);
  //correct
  const handleSaveEducation = async (formData) => {
    // console.log("saved", formData);
    try {
      const res = await axios.post(
        "http://localhost:8081/education/addEducation",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status === 200) {
        setEducations(res.data);
        setMessage("Education Added Successfully");
      }
    } catch (e) {
      console.log("edu err", e);
    }
  };
  //correct
  const getUserEducation = async () => {
    try {
      console.log("hmmmm");
      const res = await axios.get(
        "http://localhost:8081/education/getEducation",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("chamaila", res);
      if (res.status === 200) setEducations(res.data);
    } catch (e) {
      console.log("exp err", e);
    }
  };

  const displayedEducations = showAllEducations
    ? educations
    : educations.slice(0, maxVisible);

  //correct
  const deleteEducation = async (index) => {
    try {
      const educationTobeDeleted = educations[index];
      console.log("haaaaaaahhhhhhhhh", educationTobeDeleted.educationId);
      const res = await axios.post(
        "http://localhost:8081/education/deleteEducation",
        {
          educationId: educationTobeDeleted.educationId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status === 200) {
        getUserEducation();
        setMessage("Education deleted successfully");
        setErr("");
      }
    } catch (e) {
      console.log("err deleting education".e);
    }
  };

  // handleLinks

  const handleOpenLinks = () => {
    console.log("hm");

    setIsLinkOpen(true);
  };
  const handleCloseLinks = () => {
    setIsLinkOpen(false);
  };
  const platformIcons = {
    github: <FaGithub />,
    linkedin: <FaLinkedin size={24} color="blue" />,
    twitter: <FaTwitter size={24} color="black" />,
    instagram: <FaInstagram size={24} color="deep-pink" />,
    portfolio: <FaUserCircle color="yellow" />,
    leetcode: <FaLink />,
    codechef: <FaLink />,
    hackerrank: <FaLink />,
    codeforces: <FaLink />,
    facebook: <FaFacebook color="blue" />,
    codingninjas: <FaLink />,
    medium: <FaMedium />,
    atCoder: <FaLink />,
  };

  const handleSaveLinks = async (links) => {
    try {
      // console.log(links);
      const res = await axios.post(
        "http://localhost:8081/links/addLinks",
        links,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status === 200) {
        handleGetLinks();
        setMessage("Links Added Successfully");
        setErr("");
        console.log("links added successfully");
      }
    } catch (e) {
      console.log("save links err", e);
    }
  };
  
  const displayedLinks = showAllLinks ? links : links.slice(0, 3);
  const handleGetLinks = async () => {
    try {
      const res = await axios.get("http://localhost:8081/links/getLinks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.status === 200) {
        // console.log(res.data[0].platform);
        setLinks(res.data);
      }
    } catch (e) {
      console.log("save links err", e);
    }
  };

  const displayedCertificates = showAllCertificates
    ? certificates
    : certificates.slice(0, 3);
  const handleOpenCertificates = () => {
    setIsCertificationOpened(true);
  };

  const handleCloseCertificates = () => {
    setIsCertificationOpened(false);
  };
  const handleSaveCertificates = async (formData) => {
    try {
      const res = await axios.post(
        "http://localhost:8081/certificates/addCertificate",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status === 200) {
        getCertificates();
        setMessage("Certificate Added successfully");
        setErr("");
      }
    } catch {
      console.log("error certi", e);
    }
  };
  const getCertificates = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8081/certificates/getCertificates",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status === 200) {
        setCertificates(res.data);
        console.log(res);
      }
    } catch {
      console.log("err getting certi", e);
    }
  };
  const deleteCertificate = async (index) => {
    try {
      const data = certificates[index];
      console.log(data);
      const res = await axios.post(
        "http://localhost:8081/certificates/deleteCertificate",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status === 200) {
        console.log("deleted");
        getCertificates();
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Determine the certificates to display based on the state
  return (
    <div className="h-auto">
      <Navbar />
      <div className="w-full h-auto bg-[#F5F5F5] flex justify-center items-center">
        <div className="w-[80%] h-auto  flex justify-center ">
          <div className="w-[35%] h-auto flex flex-col items-center gap-10 mt-16 mb-6 ">
            {/* Avatar */}
            <Tilt className="h-[200px] w-[90%] p-4 border border-1 border-[#FFFEF0 ] bg-white">
              <div className="flex justify-between items-center">
                <div className="avatar ">
                  <div
                    className="w-14 rounded-full cursor-pointer"
                    onClick={handleImageUpload}
                  >
                    <img
                      src={
                        profileDetails?.[1]
                          ? profileDetails[1]
                          : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      }
                      alt="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    />
                  </div>
                </div>
                <button className="text-base text-blue-500">Edit</button>
              </div>

              <h1 className="font-bold text-base text-black mt-2">
                {(profileDetails?.[0] ? profileDetails[0] : "John Doe") ||
                  "John Doe"}
              </h1>

              <br></br>
              <br></br>
              <h1 className="font-bold text-xl text-black">
                Software Developer
              </h1>
            </Tilt>
            <Tilt className="h-[200px] w-[90%] bg-white border border-1 border-[#FFFEF0 ]  p-4 flex flex-col justify-between ">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">
                  Personal Information
                </h1>
                <button className="text-base text-blue-500">Edit</button>
              </div>
              <div className="h-[70%] flex flex-col justify-around items-center">
                <div className="w-[95%] flex-col gap-4 items-center">
                  <div className="flex items-center gap-2">
                  <HiOutlineMailOpen />
                  <p className="text-base text-black ">
                    {(profileDetails && profileDetails[3]) ||
                      "johndoeoff@gmail.com"}
                  </p>
                  </div>
                 
                  <span className="text-blue-400 cursor-pointer" onClick={""}>Verify</span>
                </div>
                <div className="w-[95%] flex gap-4 items-center">
                  <MdCall />
                  <p className="text-base text-black ">(+91) 9749700161</p>
                </div>
                <div className="w-[95%] flex gap-4 items-center">
                  <FaLocationDot />
                  <p className="text-base text-black ">India</p>
                </div>
              </div>
            </Tilt>
            {/* Need Modification */}
            <Tilt className="h-[200px] w-[90%] bg-white border border-[#FFFEF0 ] p-4 flex flex-col gap-4 ">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">My Resume</h1>

                <button
                  className={`text-base text-blue-500 `}
                  onClick={handleResumeUpload}
                >
                  {!resumeId ? "+ Add Resume" : "Edit"}
                </button>
              </div>
              {!resumeId ? (
                <p className="font-base text-gray-500">Add you resume here</p>
              ) : (
                <div className="flex items-center justify-center w-[90%]">
                  <div className="mb-[10px] p-[10px] border border-1 border-[#ccc] rounded-md flex  justify-between m-2 items-center w-[90%]">
                    <a
                      href={getFileDownloadURL(resumeId)} // Use the download URL for the uploaded file
                      download // Forces download when the user clicks
                      style={{ color: "#007BFF", textDecoration: "none" }}
                    >
                      {"Your Resume"}
                    </a>
                    <MdDelete
                      className="cursor-pointer"
                      onClick={handleDeleteFile}
                    />
                  </div>
                </div>
              )}
            </Tilt>
            <Tilt className="w-[90%] bg-white border border-[#FFFEF0] p-4 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">Skills</h1>
                {!isAdding && (
                  <button
                    onClick={() => setIsAdding(true)}
                    className="text-base text-blue-500"
                  >
                    + Add
                  </button>
                )}
              </div>

              {skills.length === 0 && !isAdding && (
                <p className="text-gray-500 italic">
                  No skills added yet. Click "+ Add" to add skills.
                </p>
              )}

              {/* Skills List */}
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 &&
                  skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-100 text-black border border-gray-200 rounded px-3 py-1"
                    >
                      <span className="mr-2">{skill}</span>
                      <button
                        onClick={() => handleDeleteSkill(skill)}
                        className="text-red-500 hover:text-red-700"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
              </div>

              {/* Add Skill Input */}
              {isAdding && (
                <div className="flex items-center justify-evenly gap-2 mt-4">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={handleKeyDown} // Handle Enter key
                    placeholder="Enter a skill"
                    className="flex-1 border border-gray-300 rounded p-2 text-black max-w-[50%]"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="bg-blue-500 text-white px-4 py-2 rounded "
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setIsAdding(false)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Close
                  </button>
                </div>
              )}
            </Tilt>
          </div>


         {/* //right part */}
          <div className="w-[65%] h-auto flex flex-col p-7 gap-10 items-center my-8">
            <Tilt className="w-[90%] min-h-[200px] bg-white p-4 rounded-lg border border-1 border-[#FFFEF0 ]">
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <MdOutlineWork size={23} />
                  <p className="font-bold text-xl ">Work Experience</p>
                </div>
                <button
                  className="text-base text-blue-500 flex gap-1 items-center"
                  onClick={handleOpenExperience}
                >
                  <FaPlus size={14} />
                  Add Experience
                </button>
              </div>

              <div className="mt-4">
                {Array.isArray(experiences) && experiences.length > 0 ? (
                  <ul className="space-y-6">
                    {displayedExperiences.map((experience, index) => (
                      <li
                        key={index}
                        className="group p-6 bg-white/50 rounded-xl hover:bg-white border border-blue-100/20 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-4 w-full">
                            <div className="flex justify-between items-center">
                              <h3 className="font-bold text-xl text-gray-800">
                                {experience.companyName}
                              </h3>
                              <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-2">
                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                  <Edit2 size={18} />
                                </button>
                                <button
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  onClick={() => deleteExperience(index)}
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex flex-wrap gap-2 items-center">
                                <span className="px-3 py-1 bg-blue-100/50 text-blue-700 rounded-full text-sm font-medium">
                                  {experience.role}
                                </span>
                                <span className="text-gray-400">
                                  <MdLocationOn size={14} color="gray" />
                                </span>
                                <span className="text-gray-600 text-sm">
                                  {experience.location}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-gray-500">
                                {`${experience.startDate} - ${experience.endDate}`}
                              </p>
                              <p className="text-gray-600 leading-relaxed">
                                {experience.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-gray-500">
                    Add your work experience. Don’t forget to add those
                    internships as well.
                  </p>
                )}

                {Array.isArray(experiences) &&
                  experiences.length > maxVisible && (
                    <button
                      onClick={() => setShowAllExperiences(!showAllExperiences)}
                      className="mt-4 text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                    >
                      {showAllExperiences ? (
                        <>
                          Show less <ChevronUp size={16} />
                        </>
                      ) : (
                        <>
                          Show more <ChevronDown size={16} />
                        </>
                      )}
                    </button>
                  )}
              </div>
            </Tilt>

            <Tilt className="w-[90%] min-h-[200px] bg-white p-4 rounded-lg border border-1 border-[#FFFEF0 ]">
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <MdOutlineWork size={23} />
                  <p className="font-bold text-xl ">Education</p>
                </div>
                <button
                  className="text-base text-blue-500 flex gap-1 items-center"
                  onClick={handleOpenEducation}
                >
                  <FaPlus size={14} />
                  Add Education
                </button>
              </div>

              <div className="mt-4">
                {Array.isArray(educations) && educations.length > 0 ? (
                  <ul className="space-y-6">
                    {displayedEducations.map((education, index) => (
                      <li
                        key={index}
                        className="group p-6 bg-white/50 rounded-xl hover:bg-white border border-blue-100/20 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-4 w-full">
                            <div className="flex justify-between items-center">
                              <h3 className="font-bold text-xl text-gray-800">
                                {education.organizationName}
                              </h3>
                              <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-2">
                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                  <Edit2 size={18} />
                                </button>
                                <button
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  onClick={() => deleteEducation(index)}
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>

                            <div className="space-y-4 flex-col gap-8">
                              <div className="flex-col space-y-4 justify-evenly my-4 gap-2 items-center">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="px-3 py-1 bg-blue-100/50 text-blue-700 rounded-full text-sm font-medium">
                                    {education.degree}
                                  </span>
                                  <span className="px-3 py-1 bg-blue-100/50 text-blue-700 rounded-full text-sm font-medium">
                                    {education.department}
                                  </span>
                                </div>
                                <div className="flex items-center justify-start gap-6">
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-400">
                                      <MdLocationOn size={14} color="gray" />
                                    </span>
                                    <span className="text-gray-600 text-sm">
                                      {education.location}
                                    </span>
                                  </div>
                                  <div className="text-gray-600 text-sm flex gap-2 items-center">
                                    <p>
                                      {education.scoreType}
                                      {" - "}
                                    </p>
                                    {education.score}
                                  </div>
                                </div>
                              </div>

                              <p className="text-sm font-medium text-gray-500">
                                {`${education.startDate} - ${education.endDate}`}
                              </p>
                              <p className="text-gray-600 leading-relaxed">
                                {education.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-gray-500">
                    Add your recent Education. Don’t forget to add those 10th
                    and 12th as well.
                  </p>
                )}

                {Array.isArray(educations) &&
                  educations.length > maxVisible && (
                    <button
                      onClick={() => setShowAllEducations(!showAllEducations)}
                      className="mt-4 text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                    >
                      {showAllEducations ? (
                        <>
                          Show less <ChevronUp size={16} />
                        </>
                      ) : (
                        <>
                          Show more <ChevronDown size={16} />
                        </>
                      )}
                    </button>
                  )}
              </div>
            </Tilt>
            <Tilt className="w-[90%] min-h-[220px] bg-white p-4 rounded-lg border border-1 border-[#FFFEF0] ">
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <RiLinksLine size={23} />
                  <p className="font-bold text-xl">Links</p>
                </div>
                <button
                  className="text-base text-blue-500 flex gap-1 items-center"
                  onClick={handleOpenLinks}
                >
                  <FaPlus size={14} />
                  Add Links
                </button>
              </div>

              {links.length === 0 ? (
                <div>
                  <br />
                  Add your Social Links.
                </div>
              ) : (
                <div className="mt-4">
                  {displayedLinks &&
                    displayedLinks.map((link, index) => (
                      <div
                        key={index}
                        className="flex-col items-center gap-2 mb-2"
                      >
                        <div className="flex gap-2 items-center">
                          {/* Dynamically render the platform icon */}
                          {platformIcons[link.platform] || (
                            <span className="text-gray-500">No icon</span> // Fallback if platform not found
                          )}

                          <a
                            href={link.url}
                            // target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500"
                          >
                            {link.platform.charAt(0).toUpperCase() +
                              link.platform.slice(1)}
                          </a>
                        </div>
                        <a
                          className="hover:text-cyan-500 cursor-pointer"
                          target="_blank"
                          href={link.link}
                        >
                          {link.link}
                        </a>
                      </div>
                    ))}
                </div>
              )}

              {Array.isArray(links) && links.length > 3 && (
                <button
                  onClick={() => setShowAllLinks(!showAllLinks)}
                  className="mt-4 text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                >
                  {showAllLinks ? (
                    <>
                      Show less <ChevronUp size={16} />
                    </>
                  ) : (
                    <>
                      Show more <ChevronDown size={16} />
                    </>
                  )}
                </button>
              )}
            </Tilt>

            <Tilt className="w-[90%] min-h-[200px] bg-white p-4 rounded-lg border border-1 border-[#FFFEF0 ]">
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <TbCertificate size={23} />
                  <p className="font-bold text-xl ">My Certifications</p>
                </div>
                <button
                  className="text-base text-blue-500 flex gap-1 items-center"
                  onClick={handleOpenCertificates}
                >
                  <FaPlus size={14} />
                  Add Certificates
                </button>
              </div>

              {certificates.length <= 0 ? (
                <div>
                  <br />
                  Add your Certifications.
                </div>
              ) : (
                <div className="mt-4">
                  {displayedCertificates &&
                    displayedCertificates.map((certificate, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 mb-2 justify-between mx-5"
                      >
                        <div className="flex gap-2 items-center">
                          <span className="font-medium text-blue-600">
                            {certificate.certificateProvider}
                          </span>
                          <span className="text-blue-500">-</span>
                          <span className="text-gray-800 font-semibold">
                            {certificate.certificateName}
                          </span>
                        </div>
                        <button
                          className="text-red-500 hover:text-red-700 ml-2"
                          onClick={() => deleteCertificate(index)}
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    ))}
                </div>
              )}

              {Array.isArray(certificates) && certificates.length > 3 && (
                <button
                  onClick={() => setShowAllCertificates(!showAllCertificates)}
                  className="mt-4 text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                >
                  {showAllCertificates ? (
                    <>
                      Show less <ChevronUp size={16} />
                    </>
                  ) : (
                    <>
                      Show more <ChevronDown size={16} />
                    </>
                  )}
                </button>
              )}
            </Tilt>
          </div>
        </div>
      </div>
      {imageUpload && (
        <UploadImage imageUpload={imageUpload} onClose={handleImageUpload} />
      )}
      {resumeUpload && (
        <UploadResume imageUpload={resumeUpload} onClose={handleResumeUpload} />
      )}
      {isExperienceOpen && (
        <AddExperience
          onClose={handleCloseExperience}
          onSave={handleSaveExperience}
        />
      )}
      {isEducationOpen && (
        <AddEducation
          onClose={handleCloseEducation}
          onSave={handleSaveEducation}
        />
      )}
      {isLinksOpen && (
        <AddLinks onClose={handleCloseLinks} onSave={handleSaveLinks} />
      )}
      {isCertificationOpened && (
        <AddCertifications
          onClose={handleCloseCertificates}
          onSave={handleSaveCertificates}
        />
      )}
    </div>
  );
};

export default Profile;
