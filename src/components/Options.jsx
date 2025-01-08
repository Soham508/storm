/* eslint-disable react/prop-types */
import { RxTransparencyGrid } from "react-icons/rx";
import { GoDash } from "react-icons/go";
import { AiOutlineDash } from "react-icons/ai";
import { AiOutlineSmallDash } from "react-icons/ai";
import {
  TbBorderCornerSquare,
  TbBorderCornerRounded,
  TbBorderCornerPill,
} from "react-icons/tb";
import { useState } from "react";

const Options = ({ tool, setTool }) => {
  const [opacity, setOpacity] = useState(100);

  return (
    <div className="flex flex-col w-52 p-2 items-start rounded-md bg-[#232329] gap-4 pt-2 pb-2 z-40 absolute top-60 left-4">
      <div className="bg-transparent w-full flex flex-col items-start justify-start gap-1">
        <span className="text-center text-sm text-white ml-0 font-semibold ">
          Stroke
        </span>
        <div className="flex flex-row w-full items-center justify-start gap-1">
          <button
            className={`bg-[#cbd5e1] h-6 w-6  rounded-lg p-0 ${
              tool.properties.color === "#cbd5e1" ? "border-slate-100" : ""
            }`}
            onClick={() => {
              setTool((prev) => ({
                type: prev.type,
                properties: { ...prev.properties, color: "#cbd5e1" },
              }));
            }}
          />

          <button
            className={`bg-[#b91c1c] h-6 w-6  rounded-lg p-0 ${
              tool.properties.color === "#b91c1c" ? "border-slate-100" : ""
            }`}
            onClick={() => {
              setTool((prev) => ({
                type: prev.type,
                properties: { ...prev.properties, color: "#b91c1c" },
              }));
            }}
          />
          <button
            className={`bg-[#1E90FF] h-6 w-6  rounded-lg p-0 ${
              tool.properties.color === "#1E90FF" ? "border-slate-100" : ""
            }`}
            onClick={() => {
              setTool((prev) => ({
                type: prev.type,
                properties: { ...prev.properties, color: "#1E90FF" },
              }));
            }}
          />
          <button
            className={`bg-[#32CD32] h-6 w-6  rounded-lg p-0 ${
              tool.properties.color === "#32CD32" ? "border-slate-100" : ""
            }`}
            onClick={() => {
              setTool((prev) => ({
                type: prev.type,
                properties: { ...prev.properties, color: "#32CD32" },
              }));
            }}
          />
          <button
            className={`bg-[#DAA520] h-6 w-6  rounded-lg p-0 ${
              tool.properties.color === "#DAA520" ? "border-slate-100" : ""
            }`}
            onClick={() => {
              setTool((prev) => ({
                type: prev.type,
                properties: { ...prev.properties, color: "#DAA520" },
              }));
            }}
          />
          <button
            className={`bg-[#E55381] h-6 w-6  rounded-lg p-0 ${
              tool.properties.color === "#E55381" ? "border-slate-100" : ""
            }`}
            onClick={() => {
              setTool((prev) => ({
                type: prev.type,
                properties: { ...prev.properties, color: "#E55381" },
              }));
            }}
          />

          <div className="w-0.5 h-5 bg-zinc-500 rounded-xl" />
          <button className="bg-[#E55381] h-6 w-6  rounded-lg p-0" />
        </div>
      </div>

      <div className="bg-transparent w-full flex flex-col items-start justify-start gap-1">
        <span className="text-center text-sm text-white ml-0 font-semibold ">
          Fill Stroke
        </span>
        <div className={`flex flex-row w-full items-centerjustify-start gap-1`}>
          <button
            className={`h-6 w-6  rounded-lg p-0  ${
              tool.properties.fill === "transparent" ? "border-slate-100" : ""
            } `}
          >
            <RxTransparencyGrid
              className={`rounded-lg h-5 w-5 `}
              onClick={() => {
                setTool((prev) => ({
                  type: prev.type,
                  properties: { ...prev.properties, fill: "transparent" },
                }));
              }}
            />
          </button>
          <button
            className={`bg-[#FF5733] h-6 w-6  rounded-lg p-0 ${
              tool.properties.fill === "#FF5733" ? "border-slate-100" : ""
            }`}
            onClick={() => {
              setTool((prev) => ({
                type: prev.type,
                properties: { ...prev.properties, fill: "#FF5733" },
              }));
            }}
          />
          <button
            className={`bg-[#87CEFA] h-6 w-6  rounded-lg p-0 ${
              tool.properties.fill === "#87CEFA" ? "border-slate-100" : ""
            }`}
            onClick={() => {
              setTool((prev) => ({
                type: prev.type,
                properties: { ...prev.properties, fill: "#87CEFA" },
              }));
            }}
          />
          <button
            className={`bg-[#98FB98] h-6 w-6  rounded-lg p-0 ${
              tool.properties.fill === "#98FB98" ? "border-slate-100" : ""
            }`}
            onClick={() => {
              setTool((prev) => ({
                type: prev.type,
                properties: { ...prev.properties, fill: "#98FB98" },
              }));
            }}
          />
          <button
            className={`bg-[#FFC300] h-6 w-6  rounded-lg p-0 ${
              tool.properties.fill === "#FFC300" ? "border-slate-100" : ""
            }`}
            onClick={() => {
              setTool((prev) => ({
                type: prev.type,
                properties: { ...prev.properties, fill: "#FFC300" },
              }));
            }}
          />
          <button
            className={`bg-[#FFB6C1] h-6 w-6  rounded-lg p-0 ${
              tool.properties.fill === "#FFB6C1" ? "border-slate-100" : ""
            }`}
            onClick={() => {
              setTool((prev) => ({
                type: prev.type,
                properties: { ...prev.properties, fill: "#FFB6C1" },
              }));
            }}
          />
          <div className="w-0.5 h-5 bg-zinc-500 rounded-xl" />
          <button className="bg-[#E55381] h-6 w-6  rounded-lg p-0" />
        </div>
      </div>

      <div className="bg-transparent w-full flex flex-col items-start justify-start gap-1">
        <span className="text-center text-sm text-white ml-0 font-semibold ">
          Stroke Style
        </span>
        <div className="flex flex-row w-full items-center justify-start gap-1">
          <button
            className={`h-8 w-8 flex items-center justify-center ${
              tool.properties.strokeStyle[0] === 0
                ? "bg-slate-600 "
                : "bg-zinc-700 "
            } hover:bg-zinc-900  rounded-lg p-0.5`}
            onClick={() => {
              setTool((prev) => ({
                type: prev.type,
                properties: { ...prev.properties, strokeStyle: [0, 0] },
              }));
            }}
          >
            <GoDash className="w-full h-full" />
          </button>
          <button
            className={`h-8 w-8 flex items-center justify-center ${
              tool.properties.strokeStyle[0] === 15
                ? "bg-slate-600 "
                : "bg-zinc-700 "
            } hover:bg-zinc-900  rounded-lg p-0.5`}
            onClick={() => {
              setTool((prev) => ({
                type: prev.type,
                properties: { ...prev.properties, strokeStyle: [15, 15] },
              }));
            }}
          >
            <AiOutlineDash className="w-full h-full" />
          </button>
          <button
            className={`h-8 w-8 flex items-center justify-center ${
              tool.properties.strokeStyle[0] === 10
                ? "bg-slate-600 "
                : "bg-zinc-700 "
            } hover:bg-zinc-900  rounded-lg p-0.5`}
            onClick={() => {
              setTool((prev) => ({
                type: prev.type,
                properties: { ...prev.properties, strokeStyle: [10, 10] },
              }));
            }}
          >
            <AiOutlineSmallDash className="w-full h-full" />
          </button>
        </div>
      </div>

      <div className="bg-transparent w-full flex flex-col items-start justify-start gap-1">
        <span className="text-center text-sm text-white ml-0 font-semibold ">
          Stroke Style
        </span>
        <div className="flex flex-row w-full items-center justify-start gap-1">
          <button
            className={`h-8 w-8 flex items-center justify-center ${
              tool.properties.strokeWidth === 2
                ? "bg-slate-600 "
                : "bg-zinc-700 "
            } hover:bg-zinc-900  rounded-lg p-1`}
            onClick={() => {
              setTool((prev) => ({
                type: prev.type,
                properties: { ...prev.properties, strokeWidth: 2 },
              }));
            }}
          >
            <span className="w-full h-[1px] bg-slate-100 rounded-lg"></span>
          </button>
          <button
            className={`h-8 w-8 flex items-center justify-center ${
              tool.properties.strokeWidth === 4
                ? "bg-slate-600 "
                : "bg-zinc-700 "
            } hover:bg-zinc-900  rounded-lg p-1`}
            onClick={() => {
              setTool((prev) => ({
                type: prev.type,
                properties: { ...prev.properties, strokeWidth: 4 },
              }));
            }}
          >
            <span className="w-full h-[2px] bg-slate-100 rounded-lg" />
          </button>
          <button
            className={`h-8 w-8 flex items-center justify-center ${
              tool.properties.strokeWidth === 6
                ? "bg-slate-600 "
                : "bg-zinc-700 "
            } hover:bg-zinc-900  rounded-lg p-1`}
            onClick={() => {
              setTool((prev) => ({
                type: prev.type,
                properties: { ...prev.properties, strokeWidth: 6 },
              }));
            }}
          >
            <span className="w-full h-[3px] bg-slate-100 rounded-lg" />
          </button>
          <button
            className={`h-8 w-8 flex items-center justify-center ${
              tool.properties.strokeWidth === 9
                ? "bg-slate-600 "
                : "bg-zinc-700 "
            } hover:bg-zinc-900  rounded-lg p-1`}
            onClick={() => {
              setTool((prev) => ({
                type: prev.type,
                properties: { ...prev.properties, strokeWidth: 9 },
              }));
            }}
          >
            <span className="w-full h-[4px] bg-slate-100 rounded-lg" />
          </button>
        </div>
      </div>

      {["rectangle", "textbox"].includes(tool.type) && (
        <div className="bg-transparent w-full flex flex-col items-start justify-start gap-1">
          <span className="text-center text-sm text-white ml-0 font-semibold ">
            Corner Sharpness
          </span>
          <div className="flex flex-row w-full items-center justify-start gap-1">
            <button
              className={`h-8 w-8 flex items-center justify-center hover:bg-zinc-900  rounded-lg p-0.5
                ${
                  tool.properties.cornerRadius === 0
                    ? "bg-slate-600 "
                    : "bg-zinc-700 "
                }
                `}
              onClick={() => {
                setTool((prev) => ({
                  type: prev.type,
                  properties: { ...prev.properties, cornerRadius: 0 },
                }));
              }}
            >
              <TbBorderCornerSquare />
            </button>
            <button
              className={`h-8 w-8 flex items-center justify-center hover:bg-zinc-900  rounded-lg p-0.5
                ${
                  tool.properties.cornerRadius === 15
                    ? "bg-slate-600 "
                    : "bg-zinc-700 "
                }
                `}
              onClick={() => {
                setTool((prev) => ({
                  type: prev.type,
                  properties: { ...prev.properties, cornerRadius: 15 },
                }));
              }}
            >
              <TbBorderCornerRounded />
            </button>
            <button
              className={`h-8 w-8 flex items-center justify-center hover:bg-zinc-900  rounded-lg p-0.5
                ${
                  tool.properties.cornerRadius === 40
                    ? "bg-slate-600 "
                    : "bg-zinc-700 "
                }
                `}
              onClick={() => {
                setTool((prev) => ({
                  type: prev.type,
                  properties: { ...prev.properties, cornerRadius: 40 },
                }));
              }}
            >
              <TbBorderCornerPill />
            </button>
          </div>
        </div>
      )}

      {tool.type === "curve" && (
        <div className="bg-transparent w-full flex flex-col items-start justify-start gap-1">
          <span className="text-center text-sm text-white ml-0 font-semibold ">
            Tension
          </span>
          <div className="flex flex-row w-full items-center justify-start gap-1">
            <button
              className={`h-8 w-8 flex items-center justify-center hover:bg-zinc-900  rounded-lg p-0.5
                ${
                  tool.properties.tension === 0
                    ? "bg-slate-600 "
                    : "bg-zinc-700 "
                }
                `}
              onClick={() => {
                setTool((prev) => ({
                  type: prev.type,
                  properties: { ...prev.properties, tension: 0 },
                }));
              }}
            >
              <TbBorderCornerSquare />
            </button>
            <button
              className={`h-8 w-8 flex items-center justify-center hover:bg-zinc-900  rounded-lg p-0.5
                ${
                  tool.properties.tension === 0.25
                    ? "bg-slate-600 "
                    : "bg-zinc-700 "
                }
                `}
              onClick={() => {
                setTool((prev) => ({
                  type: prev.type,
                  properties: { ...prev.properties, tension: 0.25 },
                }));
              }}
            >
              <TbBorderCornerRounded />
            </button>
            <button
              className={`h-8 w-8 flex items-center justify-center  hover:bg-zinc-900  rounded-lg p-0.5
                ${
                  tool.properties.tension === 0.35
                    ? "bg-slate-600 "
                    : "bg-zinc-700 "
                }
                `}
              onClick={() => {
                setTool((prev) => ({
                  type: prev.type,
                  properties: { ...prev.properties, tension: 0.35 },
                }));
              }}
            >
              <TbBorderCornerPill />
            </button>
          </div>
        </div>
      )}

      {
        //<div className="bg-transparent w-full flex flex-col items-start justify-start gap-1">
        //  <span className="text-center text-sm text-white ml-0 font-semibold ">
        //    Stroke Shadow
        //  </span>
        //  <div className="flex flex-row w-full items-center justify-start gap-1">
        //    <button className="h-6 w-6  rounded-lg p-0">
        //      <RxTransparencyGrid color="pink" className="rounded-lg h-5 w-5" />
        //    </button>
        //    <button className="bg-slate-300 h-6 w-6  rounded-lg p-0" />
        //    <button className="bg-blue-500 h-6 w-6  rounded-lg p-0" />
        //    <button className="bg-[#F2F4CB] h-6 w-6  rounded-lg p-0" />
        //    <button className="bg-[#B7990D] h-6 w-6  rounded-lg p-0" />
        //    <button className="bg-[#E55381] h-6 w-6  rounded-lg p-0" />
        //  </div>
        //</div>
      }

      <div className="bg-transparent w-full flex flex-col items-start justify-start gap-1">
        <span className="text-center text-sm text-white ml-0 font-semibold ">
          Opacity
        </span>
        <div className="flex flex-row w-full items-center justify-start gap-2">
          <input
            type="range"
            min="0"
            max="100"
            value={opacity}
            onChange={(e) => {
              setOpacity(e.target.value);
              setTool((prev) => ({
                type: prev.type,
                properties: { ...prev.properties, opacity: opacity },
              }));
              console.log(tool);
            }}
            className="w-full h-3 bg-gray-200 rounded-lg"
          />
          <div className="flex items-center justify-center">
            <span className="text-xs text-white">{opacity}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Options;
