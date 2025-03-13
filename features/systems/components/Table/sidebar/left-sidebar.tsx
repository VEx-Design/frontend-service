"use client";
import { useCanvas } from "../../../contexts/CanvasContext";

const LeftSidebar = () => {
  const { objects, selectedObjectId, setSelectedObjectId } = useCanvas();

  return (
    <div className="w-64 h-full overflow-y-auto border-r border-[#EEEEEE] bg-white">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-3 border-b border-[#EEEEEE]">
          <h2 className="text-sm font-medium text-[#333333]">Object List</h2>
        </div>

        {/* Object list */}
        <div className="py-2">
          {objects.length === 0 ? (
            <div className="text-xs text-[#666666] italic px-3">No objects</div>
          ) : (
            <ul className="space-y-0.5">
              {objects.map((obj) => (
                <li
                  key={obj.id}
                  onClick={() => setSelectedObjectId(obj.id)}
                  className={`
                    px-3 py-1.5 text-xs transition-colors 
                    ${
                      selectedObjectId === obj.id
                        ? "bg-[#F8F8F8] text-[#333333] font-medium"
                        : "text-[#333333] hover:bg-[#F8F8F8] cursor-pointer"
                    }
                  `}
                >
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#666666] mr-2"></div>
                    {obj.name}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
