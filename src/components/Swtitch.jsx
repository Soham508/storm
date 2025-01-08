import { useState } from "react";

const Swtitch = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  return (
    <button
      onClick={() => {
        setIsDarkMode(!isDarkMode);
      }}
      className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors duration-300 ${
        isDarkMode ? "bg-gray-700" : "bg-indigo-500"
      }`}
    >
      <span
        className={`absolute h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-500 ${
          isDarkMode ? "-translate-x-5 m-1" : "translate-x-0"
        }`}
      ></span>
    </button>
  );
};

export default Swtitch;
