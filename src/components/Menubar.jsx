import { PiFolderOpenLight } from "react-icons/pi";
import { TfiDownload } from "react-icons/tfi";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { FiHelpCircle } from "react-icons/fi";

const Menubar = (stageRef) => {
  console.log(stageRef);

  return (
    <div className="flex flex-col p-2 items-start rounded-md bg-[#232329] gap-2 pt-2 pb-2 z-50 absolute top-20 left-4">
      <button className="bg-transparent flex flex-row items-center gap-2 text-slate-100 text-sm w-full hover:bg-zinc-900 focus:outline-0 active:bg-zinc-900/60">
        <PiFolderOpenLight size={16} />
        <span className="items-start">Open</span>
      </button>
      <button className="bg-transparent flex flex-row items-center gap-2 text-slate-100 text-sm w-full hover:bg-zinc-900 focus:outline-0 active:bg-zinc-900/60">
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
