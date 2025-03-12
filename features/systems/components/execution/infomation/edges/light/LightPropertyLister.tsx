"use client";

import { useLightInfo } from "@/features/systems/contexts/Execution/LightInfoContext";
import { useEffect, useState } from "react";
import LightPropertyBox from "./LightPropertyBox";
import { useResizeDetector } from "react-resize-detector";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useConfig } from "@/features/systems/contexts/ProjectWrapper/ConfigContext";

export default function LightPropertyLister() {
  const { lightInfo } = useLightInfo();
  const hiddenParamId = [
    "e82e6c79-4e2b-457f-aef7-02ab28cd19c1",
    "c1ff5f01-8383-44e3-b5f1-b2aca399c8fd",
  ];
  const { ref, height } = useResizeDetector();
  const [parentHeight, setParentHeight] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { configAction } = useConfig();

  useEffect(() => {
    if (height) {
      setParentHeight(height); // Update height automatically
    }
  }, [height]);

  // Filter parameters based on search query
  const filteredParams = lightInfo?.params
    .filter((param) => !hiddenParamId.includes(param.paramId))
    .filter((param) => {
      const parameter = configAction.getParameter(param.paramId);
      return (
        searchQuery === "" ||
        parameter?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parameter?.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    });

  return (
    <div className="flex h-full flex-col gap-3 px-4 py-2 bg-white">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search properties..."
          className="pl-9 h-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div ref={ref} className="flex flex-col flex-1 h-full">
        <ScrollArea
          className="pr-4"
          style={{ height: parentHeight - 90 }} // Adjusted for search input height
          scrollHideDelay={0}
        >
          <div className="flex flex-col gap-2 h-full">
            {filteredParams && filteredParams.length > 0 ? (
              filteredParams.map((param) => (
                <LightPropertyBox key={param.paramId} lightParam={param} />
              ))
            ) : (
              <div className="flex items-center justify-center h-20 text-muted-foreground text-sm italic">
                {searchQuery
                  ? "No matching properties found"
                  : "No properties available"}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
