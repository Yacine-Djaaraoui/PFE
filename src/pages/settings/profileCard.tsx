import { RootState } from "@/redux/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const ProfileCard: React.FC = () => {
const profile = useSelector((state: RootState) => state.auth.profile);
  const [profilePic, setProfilePic] = useState(profile?.profile_picture_url
  );
  console.log( profile?.profile_picture_url);
  console.log(profilePic);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSaveImage = () => {
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setProfilePic(imageUrl);
      setIsModalOpen(false);
    }
  };

  const profileDetails = [
    { label: "Mes contacts", value: "128" },
    { label: "MATRICULE ÉTUDIANT", value: "202134035599" },
    { label: "DATE DE NAISSANCE", value: "01-01-2004" },
    { label: "ANNÉE UNIVERSITAIRE", value: "1ère année second cycle" },
    { label: "SPÉCIALITÉ", value: "/" },
    { label: "NUMÉRO DE TÉLÉPHONE", value: "/" },
    { label: "À joint", value: "Avril 2021" },
  ];

  return (
    <div className="mt-12 ml-7 h-[86vh] bg-white text-gray-800 w-1/3 font-inter">
      <div className="flex flex-col items-start h-full">
        <img
          src={profile?.profile_picture_url}
          alt="Profile"
          className="w-36 h-36 rounded-md object-cover cursor-pointer border border-gray-300"
          onClick={() => setIsModalOpen(true)}
        />
        <h2 className="text-[16px] font-semibold mt-4">
          {profile?.username}
        </h2>
        <p className="text-sm text-gray-500 text-center mt-2">
          You can add your bio here and put what you do, your skills, etc.
        </p>
        <div className="mt-4 text-sm">
          {profileDetails.map((detail, index) => (
            <div key={index} className="py-2.5">
              <p className="font-medium">{detail.label.toUpperCase()}</p> 
              <p className="font-semibold text-[16px]">{detail.value}</p>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg text-center w-80">
            <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
            <button
              className="w-full bg-gray-200 py-2 rounded-lg mb-2"
              onClick={() => window.open(profilePic, "_blank")}
            >
              See Profile Pic
            </button>
            <input
              type="file"
              className="hidden"
              id="fileInput"
              onChange={handleImageChange}
              accept="image/*"
            />
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-lg mb-2"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              Change Profile Pic
            </button>
            {selectedFile && (
              <button
                className="w-full bg-green-500 text-white py-2 rounded-lg mb-2"
                onClick={handleSaveImage}
              >
                Save
              </button>
            )}
            <button
              className="w-full bg-red-500 text-white py-2 rounded-lg"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
