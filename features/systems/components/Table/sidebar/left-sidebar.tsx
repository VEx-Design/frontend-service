"use client";
import { useCanvas } from "../../../contexts/CanvasContext";

const LeftSidebar = () => {
  const { objects, selectedObjectId, setSelectedObjectId } = useCanvas();

  return (
    <div className="w-64 h-full overflow-y-auto border-r border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-bold">Object List</h4>
        </div>

        {/* Object list */}
        <div>
          {objects.length === 0 ? (
            <div className="text-sm text-gray-500 italic pl-2">No objects</div>
          ) : (
            <ul className="space-y-1">
              {objects.map((obj) => (
                <li
                  key={obj.id}
                  onClick={() => setSelectedObjectId(obj.id)}
                  className={`
                      px-3 py-2 rounded-md text-sm transition-all duration-150 
                      ${
                        selectedObjectId === obj.id
                          ? "bg-gray-150 text-sm ms-1 font-bold "
                          : "text-sm ms-1 hover:bg-gray-100 cursor-pointer"
                      }
                    `}
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-400 mr-2"></div>
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
