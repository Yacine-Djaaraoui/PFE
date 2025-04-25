import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaPencilAlt } from "react-icons/fa";
import { ReactSVG } from "react-svg";
import editIcon from "@/assets/basil_edit-outline.svg";
import editSquare from "@/assets/Edit-Square.svg";
import { useThemes } from "@/hooks/themes";

const Mytheme = () => {
  const [isThemesOpen, setIsThemesOpen] = useState(false);
  const { data: themesData } = useThemes({
    ordering: "created_at",
    is_verified: true,
    is_member: true,
  });
  return (
    <>
      {themesData?.results?.length > 0 && (
        <div className="w-full px-4">
          <div className="flex justify-between items-center mb-4">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setIsThemesOpen(!isThemesOpen)} // Toggle visibility
            >
              <ReactSVG src={editSquare} className="w-5 h-5" />
              <h2 className="text-[16px] font-medium text-[#092147] border-b border-black">
                Mon théme
              </h2>
              {/* Chevron icon that rotates based on state */}
              {isThemesOpen ? (
                <FaChevronUp className="text-gray-600 text-sm" />
              ) : (
                <FaChevronDown className="text-gray-600 text-sm" />
              )}
            </div>
            {/* <button
                    className="rounded-full hover:bg-gray-300 p-1"
                    onClick={() => setIsAddThemeOpen(true)}
                  >
                    <ReactSVG src={plus} className="w-5 h-5" />
                  </button> */}
          </div>
          {/* Themes List */}
          {isThemesOpen && (
            <div className="space-y-3">
              {themesData?.results?.map((theme) => (
                <div
                  key={theme.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100"
                >
                  <div>
                    <h3 className="font-normal text-[#141B34]">
                      # {theme.id.toString().padStart(2, "0")} {theme.title}
                    </h3>
                    {theme.academic_year && (
                      <span className="text-xs text-gray-500">
                        Année Academique: {theme.academic_year}
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-1">
                    <button className="p-1 rounded-md hover:bg-gray-200">
                      <ReactSVG src={editIcon} className="w-5 h-5 mr-0.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Mytheme;
