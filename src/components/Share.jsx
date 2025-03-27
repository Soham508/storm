/* eslint-disable react/prop-types */
import { LuCopy } from "react-icons/lu";
import { LuCopyCheck } from "react-icons/lu";
import { useState } from "react";

const Share = ({ share }) => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  return (
    <>
      {share ? (
        <div className="flex flex-col w-1/5 min-h-80 p-6 justify-between items-center rounded-md bg-[#232329] gap-4 z-40 absolute top-60 left-[40%]">
          <h2 className="font-semibold text-2xl">Collborate with others!</h2>
          <div className="flex flex-col gap-5 justify-between items-center">
            {error && (
              <span className="text-gray-200 bg-red-600 border border-red-400 px-3 py-1 rounded-lg shadow-sm font-medium animate-pulse">
                Server is currently out of service!
              </span>
            )}
            <div className="flex flex-row gap-2 items-center justify-center">
              <kbd className="px-3 py-1 w-72 rounded-md bg-zinc-700 text-gray-200 text-sm font-mono shadow-inner border border-gray-300">
                session-code
              </kbd>
              <div
                onClick={() => {
                  setCopied((prev) => !prev);
                }}
                className="hover:cursor-pointer"
              >
                {copied ? <LuCopyCheck size={24} /> : <LuCopy size={24} />}
              </div>
            </div>

            <button
              onClick={() => {
                setError(true);
              }}
              className="bg-gradient-to-r border-0 from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold py-2 px-6 rounded-2xl shadow-xl drop-shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Create Session
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Share;
