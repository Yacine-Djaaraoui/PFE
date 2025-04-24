import React from "react";
import { FaPencilAlt } from "react-icons/fa";

const Mytheme = () => {
  return (
    <div
      key={theme.id}
      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100"
    >
      <h3 className="font-medium text-[#0D062D]">
        #{theme.id.toString().padStart(2, "0")} {theme.title}
      </h3>
      <div className="flex space-x-2">
        <button className="p-2 rounded-md hover:bg-gray-200">
          <FaPencilAlt className="text-gray-600" />
        </button>
        {/* <button
          className="p-2 rounded-md hover:bg-gray-200 hover:text-red-500"
          onClick={() => handleDeleteClick(theme.id)}
          disabled={deleteThemeMutation.isPending}
        >
          <FaTrash className="text-gray-600 hover:text-red-500" />
        </button> */}
      </div>
    </div>
  );
};

export default Mytheme;
