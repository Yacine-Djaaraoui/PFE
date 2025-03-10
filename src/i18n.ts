import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Cookies from "js-cookie";

// Import translations
import loginAR from "./locales/ar/login.json"; // Add login translations
import loginFR from "./locales/fr/login.json";

// Detect language from cookie or browser settings
const lng = Cookies.get("i18next") || "fr";

i18n.use(initReactI18next).init({
  resources: {
    ar: {
      login: loginAR,
    },
    fr: {
      login: loginFR,
    },
  },
  lng, // Set the initial language from cookie or browser
  fallbackLng: "fr",
  interpolation: {
    escapeValue: false,
  },
});

// Save language preference to cookie whenever it changes
i18n.on("languageChanged", (lng) => {
  Cookies.set("i18next", lng, { expires: 365 }); // Save for 1 year
});

export default i18n;
