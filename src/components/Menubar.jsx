/* eslint-disable react/prop-types */
import { PiFolderOpenLight } from "react-icons/pi";
import { TfiDownload } from "react-icons/tfi";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { FiHelpCircle } from "react-icons/fi";
//import { useState, useRef } from 'react';

const Menubar = ({ stageRef, shapes, setShapes }) => {
  console.log(stageRef, shapes);

  const handleSaveToDevice = async () => {
    try {
      // Convert the shapes object to a JSON string
      const jsonString = JSON.stringify(shapes, null, 2);

      // Create a Blob from the JSON string
      const blob = new Blob([jsonString], { type: "application/json" });

      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create a temporary anchor element for download
      const link = document.createElement("a");
      link.href = url;
      link.download = "shapes.json"; // Filename

      // Append to the document, click to trigger download, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the Blob URL
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error saving JSON file:", error);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result); // Deserialize JSON
        setShapes(json); // Update the state
        console.log("Loaded shapes:", json);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        alert("Invalid JSON file");
      }
    };

    reader.readAsText(file); // Read the file as a text string
  };

  const handleUploadClick = () => {
    document.getElementById("file-input").click(); // Trigger file input click
  };

  return (
    <div className="flex flex-col p-2 items-start rounded-md bg-[#232329] gap-2 pt-2 pb-2 z-50 absolute top-20 left-4">
      <button
        className="bg-transparent flex flex-row items-center gap-2 text-slate-100 text-sm w-full hover:bg-zinc-900 focus:outline-0 active:bg-zinc-900/60"
        onClick={handleUploadClick}
      >
        <PiFolderOpenLight size={16} />
        <span className="items-start">Open</span>
      </button>
      <input
        id="file-input"
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleFileUpload}
      />
      <button
        className="bg-transparent flex flex-row items-center gap-2 text-slate-100 text-sm w-full hover:bg-zinc-900 focus:outline-0 active:bg-zinc-900/60"
        onClick={handleSaveToDevice}
      >
        <TfiDownload size={16} />
        <span className="items-start">Save on device</span>
      </button>
      <button className="bg-transparent flex flex-row items-center gap-2 text-slate-100 text-sm w-full hover:bg-zinc-900 focus:outline-0 active:bg-zinc-900/60">
        <IoCloudDownloadOutline size={16} />
        <span className="items-start">Save on Cloud</span>
      </button>
      <button className="bg-transparent flex flex-row items-center gap-2 text-slate-100 text-sm w-full hover:bg-zinc-900 focus:outline-0 active:bg-zinc-900/60">
        <FiHelpCircle size={16} />
        <span className="items-start">Help</span>
      </button>
    </div>
  );
};

export default Menubar;
