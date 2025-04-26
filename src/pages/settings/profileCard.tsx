import { RootState } from "@/redux/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/utils/httpClient";

const ProfileCard: React.FC = () => {
  const profile = useSelector((state: RootState) => state.auth.profile);
  console.log(profile);
  const queryClient = useQueryClient();
  
  // State for editable fields
  const [editing, setEditing] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    username: profile?.username || '',
    phone_number: profile?.phone_number || '',
    resume: profile?.resume || ''
  });

  // Directly use useMutation for profile updates
  const { mutate: updateProfile } = useMutation({
    mutationFn: async (data: any) => {
      const token = localStorage.getItem("access_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await ApiClient().patch(`auth/users/me/`, data, {
        headers,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    }
  });

  const handleEdit = (field: string) => {
    setEditing(field);
  };

  const handleSave = (field: string) => {
    updateProfile({ [field]: editValues[field as keyof typeof editValues] });
    setEditing(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setEditValues(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const profileDetails = [
    { 
      label: "Full Name", 
      value: `${profile?.first_name || ''} ${profile?.last_name || ''}`,
      editable: false
    },
    { 
      label: "Username", 
      value: profile?.username || '',
      editable: true,
      field: 'username'
    },
    { 
      label: "Phone Number", 
      value: profile?.phone_number || '/',
      editable: true,
      field: 'phone_number'
    },
    { 
      label: "Date of Birth", 
      value: profile?.year_of_birth || '/',
      editable: false
    },
    { 
      label: "Location", 
      value: `${profile?.country || ''}${profile?.state ? `, ${profile.state}` : ''}${profile?.postal_code ? `, ${profile.postal_code}` : ''}`,
      editable: false
    },
    { 
      label: "About", 
      value: profile?.resume || 'No description yet',
      editable: true,
      field: 'resume',
      isTextArea: true
    },
  ];

  return (
    <div className="mt-12 ml-7 h-[86vh] bg-white text-gray-800 w-1/3 font-inter p-4">
      <div className="flex flex-col items-start h-full">
        <img
          src={profile?.profile_picture_url}
          alt="Profile"
          className="w-36 h-36 rounded-md object-cover border border-gray-300"
        />
        
        <div className="mt-4 w-full">
          {profileDetails.map((detail, index) => (
            <div key={index} className="py-2 border-b border-gray-100">
              <p className="font-medium text-sm text-gray-500">{detail.label}</p>
              
              {detail.editable && editing === detail.field ? (
                <div className="flex items-center mt-1">
                  {detail.isTextArea ? (
                    <textarea
                      value={editValues[detail.field as keyof typeof editValues]}
                      onChange={(e) => handleChange(e, detail.field!)}
                      className="flex-1 border rounded p-1"
                      rows={3}
                    />
                  ) : (
                    <input
                      type="text"
                      value={editValues[detail.field as keyof typeof editValues]}
                      onChange={(e) => handleChange(e, detail.field!)}
                      className="flex-1 border rounded p-1"
                    />
                  )}
                  <button 
                    onClick={() => handleSave(detail.field!)}
                    className="ml-2 text-blue-500"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center mt-1">
                  <p className="font-semibold text-[16px]">
                    {detail.value || '/'}
                  </p>
                  {detail.editable && (
                    <button 
                      onClick={() => handleEdit(detail.field!)}
                      className="text-blue-500 text-sm"
                    >
                      Edit
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;