import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoLanguage } from "react-icons/io5";
import { MdCheck } from "react-icons/md"; // For the checkmark

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false); // Close the language switcher after selection
  };

  const currentLanguage = i18n.language; // Get the current language

  return (
    <div className="relative ml-3">
      {/* Language Icon with Flag */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg p-2 border cursor-pointer text-white hover:text-black hover:bg-white flex items-center"
      >
        <IoLanguage className="text-lg" />
        <span className="ml-1">{currentLanguage === "ar" ? "AR" : "FR"}</span>
      </button>

      {/* Language Switcher Dropdown */}
      {isOpen && (
        <div className="absolute top-10  bg-white shadow-lg rounded-lg p-2 z-[100] w-40">
          {/* Arabic Option */}
          <button
            onClick={() => changeLanguage("ar")}
            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
          >
            <span className="flex items-center">
              <span className="px-2 text-secondary font-extrabold">AR</span>
              {/* Algerian flag */}
              العربية
            </span>
            {currentLanguage === "ar" && (
              <MdCheck className="text-secondary" />
            )}{" "}
            {/* Checkmark for selected language */}
          </button>

          {/* French Option */}
          <button
            onClick={() => changeLanguage("fr")}
            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
          >
            <span className="flex items-center">
              <span className="px-2 text-secondary font-extrabold">FR</span>
              {/* Algerian flag */}
              Francais
            </span>
            {currentLanguage === "fr" && (
              <MdCheck className="text-secondary" />
            )}{" "}
            {/* Checkmark for selected language */}
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
