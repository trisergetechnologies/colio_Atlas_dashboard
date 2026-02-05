import { useState } from "react";

// Predefined languages in user-friendly format
const predefinedLanguages = [
  "English",
  "Hindi",
  "Bengali",
  "Telugu",
  "Marathi",
  "Tamil",
];

function LanguagesInput({ label, languages, onChange }: any) {
  const [newLanguage, setNewLanguage] = useState("");

  const addLanguage = () => {
    if (newLanguage && !languages.includes(newLanguage)) {
      // Convert the selected language to lowercase for backend
      onChange([...languages, newLanguage.toLowerCase()]);
      setNewLanguage(""); // Clear input field after adding
    }
  };

  const removeLanguage = (language: string) => {
    onChange(languages.filter((lang: string) => lang !== language));
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <div className="flex gap-2 items-center">
        <select
          value={newLanguage}
          onChange={(e) => setNewLanguage(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm outline-none dark:border-dark-3 dark:bg-transparent"
        >
          <option value="">Select Language</option>
          {predefinedLanguages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={addLanguage}
          className="bg-primary text-white rounded px-3 py-1 text-sm"
        >
          Add
        </button>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {languages.map((language: string) => (
          <span
            key={language}
            className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-1"
          >
            {language.charAt(0).toUpperCase() + language.slice(1)} {/* Capitalizing first letter for display */}
            <button
              type="button"
              onClick={() => removeLanguage(language)}
              className="text-red-500"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}