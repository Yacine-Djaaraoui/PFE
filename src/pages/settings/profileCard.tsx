import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/api/profile";
import { useMyProfile } from "@/hooks/profile";
import { useCreateDocument } from "@/hooks/document";
import getAcademicYearLabel from "@/hoc/GlobalFunctions";
import {
  createStudentSkill,
  deleteStudentSkill,
  StudentSkill,
  updateStudentSkill,
} from "@/api/skills";

const ProfileCard: React.FC = () => {
  const { data: profile } = useMyProfile();
  const queryClient = useQueryClient();
  const createDocumentMutation = useCreateDocument();

  // State for editable fields
  const [editing, setEditing] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    username: "",
    phone_number: "",
    resume: "",
    first_name: "",
    last_name: "",
    country: "",
    state: "",
    postal_code: "",
    year_of_birth: "",
    profile_picture_url: "",
    email: "",
    skills: [] as Array<{ name: string; proficiency_level: string }>,
    current_year: "",
    facebook: "",
    github: "",
    instagram: "",
    linkedin: "",
    twitter: "",
  });

  // Initialize editValues when profile loads
  useEffect(() => {
    if (profile) {
      setEditValues({
        username: profile.username || "",
        phone_number: profile.phone_number || "",
        resume: profile.resume || "",
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        country: profile.country || "",
        state: profile.state || "",
        postal_code: profile.postal_code || "",
        year_of_birth: profile.year_of_birth?.toString() || "",
        profile_picture_url: profile.profile_picture_url || "",
        email: profile.email || "",
        skills: profile.profile?.skills || [],
        current_year: profile.profile?.current_year || "",
        facebook: profile.facebook || "",
        github: profile.github || "",
        instagram: profile.instagram || "",
        linkedin: profile.linkedin || "",
        twitter: profile.twitter || "",
      });
    }
  }, [profile]);

  const validatePhoneNumber = (phone: string): boolean => {
    // Check if it starts with 05, 06, or 07 and has exactly 10 digits
    return /^(05|06|07)\d{8}$/.test(phone);
  };

  const formatPhoneForDisplay = (phone: string | undefined): string => {
    if (!phone || phone === "Non fourni") return "";

    // If it's already in local format (05/06/07), return as is
    if (/^(05|06|07)\d{8}$/.test(phone)) return phone;

    // If it's in international format (+213...), convert to local format
    if (phone.startsWith("+213")) {
      return `0${phone.substring(4)}`;
    }

    return phone; // fallback for any other format
  };

  // Mutation for updating profile
  const profileMutation = useMutation({
    mutationFn: (data: Partial<typeof editValues>) => {
      return updateProfile(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      setEditing(null);
    },
    onError: (error: any) => {
      console.error("Échec de la mise à jour du profil:", error);
    },
  });

  const handleEdit = (field: string) => {
    setEditing(field);
  };

  const handleSave = (field: string) => {
    let valueToSend = editValues[field as keyof typeof editValues];

    // Format phone number before sending
    if (field === "phone_number") {
      const phone = valueToSend as string;
      if (!validatePhoneNumber(phone)) {
        alert(
          "Le numéro de téléphone doit commencer par 05, 06 ou 07 et avoir 10 chiffres"
        );
        return;
      }
      // Convert to international format (+213...)
      valueToSend = `+213${phone.substring(1)}`;
    }

    profileMutation.mutate({
      [field]: valueToSend,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    field: string
  ) => {
    const value = e.target.value;

    // Special handling for phone number
    if (field === "phone_number") {
      // Only allow numbers and limit to 10 digits
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setEditValues((prev) => ({
        ...prev,
        [field]: numericValue,
      }));
      return;
    }

    setEditValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveSkills = async () => {
    if (!profile?.id) return;

    try {
      // First, get current skills from the server to compare
      const currentSkills = profile.profile?.skills || [];

      // Process additions and updates
      for (const skill of editValues.skills) {
        if (!skill.id) {
          // New skill - create it
          await createStudentSkill(profile.id.toString(), {
            name: skill.name,
            proficiency_level:
              skill.proficiency_level as StudentSkill["proficiency_level"],
          });
        } else {
          // Existing skill - check if it needs update
          const originalSkill = currentSkills.find((s) => s.id === skill.id);
          if (
            !originalSkill ||
            originalSkill.name !== skill.name ||
            originalSkill.proficiency_level !== skill.proficiency_level
          ) {
            await updateStudentSkill(
              profile?.id.toString(),
              skill?.id.toString(),
              {
                name: skill.name,
                proficiency_level:
                  skill.proficiency_level as StudentSkill["proficiency_level"],
              }
            );
          }
        }
      }

      // Process deletions
      for (const currentSkill of currentSkills) {
        if (!editValues.skills.some((s) => s.id === currentSkill.id)) {
          await deleteStudentSkill(
            profile.id.toString(),
            currentSkill.id.toString()
          );
        }
      }

      // Refresh profile data
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      setEditing(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des compétences:", error);
    }
  };

  const handleSkillChange = (
    index: number,
    field: "name" | "proficiency_level",
    value: string
  ) => {
    const newSkills = [...editValues.skills];
    newSkills[index] = {
      ...newSkills[index],
      [field]: value,
    };
    setEditValues((prev) => ({
      ...prev,
      skills: newSkills,
    }));
  };

  const handleAddSkill = () => {
    setEditValues((prev) => ({
      ...prev,
      skills: [...prev.skills, { name: "", proficiency_level: "beginner" }],
    }));
  };

  const handleRemoveSkill = (index: number) => {
    const newSkills = [...editValues.skills];
    newSkills.splice(index, 1);
    setEditValues((prev) => ({
      ...prev,
      skills: newSkills,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", `Photo de profil - ${profile?.username}`);
      formData.append("document_type", "profile_picture");

      try {
        const response = await createDocumentMutation.mutateAsync(formData);
        if (response.file) {
          profileMutation.mutate({ profile_picture_url: response.file });
        }
      } catch (error) {
        console.error("Échec du téléchargement de la photo de profil:", error);
      }
    }
  };

  const proficiencyLevels = [
    {
      value: "beginner",
      label: "Débutant",
      percentage: 25,
    },
    {
      value: "intermediate",
      label: "Intermédiaire",
      percentage: 50,
    },
    {
      value: "advanced",
      label: "Avancé",
      percentage: 75,
    },
    { value: "expert", label: "Expert", percentage: 90 },
  ];

  const profileDetails = [
    {
      label: "Photo de profil",
      type: "image",
      value: profile?.profile_picture_url,
      editable: true,
      field: "profile_picture_url",
    },
    {
      label: "Email",
      value: profile?.email,
      editable: false,
      icon: "📧",
    },
    {
      label: "Matricule",
      value: profile?.profile?.matricule,
      editable: false,
      icon: "🆔",
    },
    {
      label: "Nom complet",
      value: `${profile?.first_name || ""} ${profile?.last_name || ""}`,
      editable: false,
      icon: "👤",
    },
    {
      label: "Nom d'utilisateur",
      value: profile?.username,
      editable: true,
      field: "username",
      icon: "🏷️",
    },
    {
      label: "Numéro de téléphone",
      value: formatPhoneForDisplay(profile?.phone_number),
      editable: true,
      field: "phone_number",
      icon: "📱",
    },
    {
      label: "Année de naissance",
      value: profile?.year_of_birth || "Non fourni",
      editable: false,
      field: "year_of_birth",
      icon: "🎂",
    },
    {
      label: "Localisation",
      value: `${profile?.country || ""}${
        profile?.state ? `, ${profile.state}` : ""
      }`,
      editable: false,
      field: "state",
      icon: "📍",
    },
    {
      label: "Facebook",
      value: profile?.facebook || "Non fourni",
      editable: true,
      field: "facebook",
      icon: "👍",
      type: "social",
    },
    {
      label: "GitHub",
      value: profile?.github || "Non fourni",
      editable: true,
      field: "github",
      icon: "💻",
      type: "social",
    },
    {
      label: "Instagram",
      value: profile?.instagram || "Non fourni",
      editable: true,
      field: "instagram",
      icon: "📷",
      type: "social",
    },
    {
      label: "LinkedIn",
      value: profile?.linkedin || "Non fourni",
      editable: true,
      field: "linkedin",
      icon: "🔗",
      type: "social",
    },
    {
      label: "Twitter",
      value: profile?.twitter || "Non fourni",
      editable: true,
      field: "twitter",
      icon: "🐦",
      type: "social",
    },
    {
      label: "Compétences",
      type: "skills",
      value: profile?.profile?.skills,
      editable: true,
      field: "skills",
      icon: "🛠️",
    },
    {
      label: "Résumé",
      value: profile?.resume || "Aucun résumé",
      editable: true,
      field: "resume",
      isTextArea: true,
      icon: "📝",
    },
  ];

  return (
    <div className="mt-4 ml-7 h-[86vh] bg-white shadow-lg rounded-xl text-gray-800 w-1/2 font-inter p-8 overflow-y-auto">
      <div className="flex flex-col items-start h-full">
        {/* Header Section */}
        <div className="w-full flex justify-between items-start mb-8 border-b border-gray-200 pb-6">
          <div className="flex items-center space-x-6">
            {/* Profile Picture */}
            <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg group">
              <img
                src={editValues.profile_picture_url}
                alt="Profil"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      document.getElementById("profile-picture-upload")?.click()
                    }
                    className="bg-white bg-opacity-80 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition-all"
                    title="Modifier"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() =>
                      window.open(editValues.profile_picture_url, "_blank")
                    }
                    className="bg-white bg-opacity-80 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition-all"
                    title="Voir"
                    disabled={!editValues.profile_picture_url}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <input
              type="file"
              id="profile-picture-upload"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Basic Information */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile?.first_name || ""} {profile?.last_name || ""}
              </h1>
              <p className="text-gray-500 mt-1">{profile?.email || ""}</p>
              {profile?.user_type == "student" && (
                <div className="flex mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-secondary">
                    {getAcademicYearLabel(profile?.profile?.current_year) ||
                      "Étudiant"}
                  </span>
                  {profile?.profile?.matricule && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {profile.profile.matricule}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {profileDetails.slice(1).map((detail, index) => {
            if (
              detail.label === "Photo de profil" ||
              detail.label === "Nom complet" ||
              detail.label === "Email" ||
              detail.label === "Matricule" ||
              (detail.label === "Compétences" &&
                profile?.user_type != "student")
            ) {
              return null;
            }

            if (detail.type === "skills" && profile?.user_type == "student") {
              return (
                <div
                  key={index}
                  className="col-span-full py-4 border-t border-gray-100"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      <span className="mr-2">{detail.icon}</span>
                      {detail.label}
                    </h3>
                    {detail.editable && editing !== "skills" && (
                      <button
                        onClick={() => handleEdit("skills")}
                        className="text-secondary text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition-colors duration-200"
                        disabled={profileMutation.isPending}
                      >
                        Modifier les compétences
                      </button>
                    )}
                  </div>

                  {editing === "skills" ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {editValues.skills.map((skill, skillIndex) => (
                        <div
                          key={skillIndex}
                          className="flex items-center mb-3"
                        >
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) =>
                              handleSkillChange(
                                skillIndex,
                                "name",
                                e.target.value
                              )
                            }
                            className="border border-gray-300 rounded-lg p-2 mr-2 flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Nom de la compétence"
                          />
                          <select
                            value={skill.proficiency_level}
                            onChange={(e) =>
                              handleSkillChange(
                                skillIndex,
                                "proficiency_level",
                                e.target.value
                              )
                            }
                            className="border border-gray-300 rounded-lg p-2 mr-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                          >
                            {proficiencyLevels.map((level) => (
                              <option key={level.value} value={level.value}>
                                {level.label}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleRemoveSkill(skillIndex)}
                            className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-full transition-colors duration-200"
                            aria-label="Supprimer la compétence"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={handleAddSkill}
                        className="mt-2 text-secondary hover:text-blue-800 font-medium flex items-center text-sm"
                      >
                        <span className="mr-1">+</span> Ajouter une compétence
                      </button>
                      <div className="flex justify-end mt-4 space-x-2">
                        <button
                          onClick={() => setEditing(null)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors duration-200"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={handleSaveSkills}
                          className="px-4 py-2 bg-secondary text-white rounded-lg hover:opacity-80 font-medium text-sm shadow-sm transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                          disabled={profileMutation.isPending}
                        >
                          {profileMutation.isPending
                            ? "Enregistrement..."
                            : "Enregistrer les compétences"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2">
                      {profile?.profile?.skills?.length ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {profile.profile.skills.map((skill, skillIndex) => {
                            const level = proficiencyLevels.find(
                              (l) => l.value === skill.proficiency_level
                            );
                            return (
                              <div
                                key={skillIndex}
                                className="bg-gray-50 rounded-lg p-3"
                              >
                                <div className="flex justify-between items-center text-sm mb-2">
                                  <span className="font-medium text-gray-900">
                                    {skill.name}
                                  </span>
                                  <span className="text-gray-600 bg-white px-2 py-0.5 rounded-full text-xs">
                                    {level?.label}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`${
                                      level?.color || "bg-secondary"
                                    } h-2 rounded-full transition-all duration-500 ease-out`}
                                    style={{
                                      width: `${level?.percentage || 0}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">
                          Aucune compétence ajoutée
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            }

            if (detail.field === "resume") {
              return (
                <div
                  key={index}
                  className="col-span-full py-4 border-t border-gray-100"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      <span className="mr-2">{detail.icon}</span>
                      {detail.label}
                    </h3>
                    {detail.editable && editing !== detail.field && (
                      <button
                        onClick={() => handleEdit(detail.field!)}
                        className="text-secondary text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition-colors duration-200"
                        disabled={profileMutation.isPending}
                      >
                        Modifier
                      </button>
                    )}
                  </div>

                  {editing === detail.field ? (
                    <div className="mt-2">
                      <textarea
                        value={
                          editValues[
                            detail.field as keyof typeof editValues
                          ] as string
                        }
                        onChange={(e) => handleChange(e, detail.field!)}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        rows={5}
                        placeholder="Écrivez un résumé sur vous-même..."
                      />
                      <div className="flex justify-end mt-3 space-x-2">
                        <button
                          onClick={() => setEditing(null)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors duration-200"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() => handleSave(detail.field!)}
                          className="px-4 py-2 bg-secondary text-white rounded-lg hover:opacity-80 font-medium text-sm shadow-sm transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                          disabled={profileMutation.isPending}
                        >
                          {profileMutation.isPending
                            ? "Enregistrement..."
                            : "Enregistrer"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg mt-2">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {detail.value || "Aucun résumé ajouté"}
                      </p>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div key={index} className=" py-3 overflow-hidden">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500 mb-1 flex items-center">
                    {detail.label}
                  </p>
                  {detail.editable && editing !== detail.field && (
                    <button
                      onClick={() => handleEdit(detail.field!)}
                      className="text-secondary text-xs font-medium hover:text-blue-800 transition-colors duration-200"
                      disabled={profileMutation.isPending}
                    >
                      Modifier
                    </button>
                  )}
                </div>

                {detail.editable && editing === detail.field ? (
                  <div className="mt-1 mx-1">
                    {detail.field === "phone_number" ? (
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={formatPhoneForDisplay(editValues.phone_number)}
                        onChange={(e) => handleChange(e, "phone_number")}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        maxLength={10}
                      />
                    ) : (
                      <input
                        type={
                          detail.field === "year_of_birth" ? "number" : "text"
                        }
                        value={
                          editValues[
                            detail.field as keyof typeof editValues
                          ] as string
                        }
                        onChange={(e) => handleChange(e, detail.field!)}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    )}
                    <div className="flex justify-end mt-2 space-x-2">
                      <button
                        onClick={() => setEditing(null)}
                        className="px-3 py-1 text-gray-600 text-xs font-medium hover:text-gray-800 transition-colors duration-200"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => handleSave(detail.field!)}
                        className="px-3 py-1 bg-secondary text-white rounded-md hover:opacity-80 text-xs font-medium transition-colors duration-200 disabled:opacity-70"
                        disabled={profileMutation.isPending}
                      >
                        {profileMutation.isPending
                          ? "Enregistrement..."
                          : "Enregistrer"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="font-medium text-gray-800">
                    {detail.label === "Numéro de téléphone"
                      ? formatPhoneForDisplay(detail.value as string) ||
                        "Non fourni"
                      : detail.value || "Non fourni"}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
