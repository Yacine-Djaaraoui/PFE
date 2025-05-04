const getAcademicYearLabel = (code: string) => {
  const yearMappings: Record<string, string> = {
    "2": "2ème année cycle préparatoire",
    "3": "1ère année cycle supérieur",
    "4isi": "2ème année cycle supérieur ISI",
    "4iasd": "2ème année cycle supérieur IASD",
    "4siw": "2ème année cycle supérieur SIW",
    "5isi": "3ème année cycle supérieur ISI",
    "5iasd": "3ème année cycle supérieur IASD",
    "5siw": "3ème année cycle supérieur SIW",
  };

  return yearMappings[code] || `Unknown code: ${code}`;
};

export default getAcademicYearLabel;
