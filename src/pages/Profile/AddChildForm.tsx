import React, { useState } from "react";

interface AddChildFormProps {
  parentId: number;
  onSubmit: (child: ChildData) => void;
}

interface ChildData {
  name: string;
  birthDate: string;
  allergies: string;
  specialNeeds: string;
  parent: {
    id: number;
  };
}

const AddChildForm: React.FC<AddChildFormProps> = ({ parentId, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    allergies: "",
    specialNeeds: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const child: ChildData = {
      ...formData,
      parent: { id: parentId },
    };
    onSubmit(child);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow space-y-4"
    >
      <h2 className="text-2xl font-bold text-[#F16767] mb-4">Add Your Child</h2>

      <div>
        <label className="block font-semibold mb-1">Name</label>
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Birth Date</label>
        <input
          type="date"
          name="birthDate"
          required
          value={formData.birthDate}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Allergies</label>
        <textarea
          name="allergies"
          value={formData.allergies}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Special Needs</label>
        <textarea
          name="specialNeeds"
          value={formData.specialNeeds}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <button
        type="submit"
        className="bg-[#F16767] hover:bg-red-400 text-white font-semibold px-6 py-2 rounded shadow"
      >
        Add Child
      </button>
    </form>
  );
};

export default AddChildForm;
