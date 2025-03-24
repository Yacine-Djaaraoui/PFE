import React, { useState } from "react";

const SettingCard = () => {
  const [emailVerified, setEmailVerified] = useState(false);
  return (
    <div className="w-[62.5%] mt-12 h-[80vh] bg-white p-6 border border-[#E6E6E6] rounded-lg shadow font-inter">
      <h2 className="text-sm font-bold mb-4">INFORMATIONS DU COMPTE</h2>

      {!emailVerified && (
        <div className="bg-[#97B2DF]/12 p-3 rounded-md mb-4 border border-[#E6E6E6] text-sm">
          <span className="mr-1">
            🔹 Vous n’avez pas vérifié votre e-mail !
          </span>
          <span>
            Pour publier un projet et effectuer d’autres actions, veuillez{" "}
            <a href="#" className="text-secondary font-semibold hover:underline">
              vérifier votre email.
            </a>
          </span>
        </div>
      )}

      <div className="space-y-4 w-1/2">
        <div className="space-y-2">
          <label className="block text-gray-600 text-sm font-semibold">
            Email
          </label>
          <input
            type="email"
            value="hello@esi-sba.dz"
            disabled
            className="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded-md border border-gray-300 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-600 text-sm font-semibold">
            Mot de passe{" "}
            <a
              href="#"
              className="text-secondary font-semibold hover:underline ml-2"
            >
              | Modifier
            </a>
          </label>
          <input
            type="password"
            value="************"
            disabled
            className="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded-md border border-gray-300 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default SettingCard;
