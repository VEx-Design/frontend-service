"use client";

import React from "react";
import ProjectNavbar from "../../components/ProjectNavbar";
import { ReactFlowProvider } from "@xyflow/react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TabsTriggerIcon,
} from "@/components/Tabs";
import { FileSliders, GitGraph } from "lucide-react";
import { useProject } from "../../contexts/ProjectContext";
import Editor from "../Editor";
import Configuration from "../Configuration";
import { ConfigProvider } from "../../contexts/ConfigContext";

export default function Project() {
  const { projName, onSave, savePending } = useProject();

  return (
    <>
      <ProjectNavbar
        title={projName}
        onSave={onSave}
        savePending={savePending}
      />
      <Tabs type="side">
        <TabsList>
          <TabsTrigger name="Flow">
            <TabsTriggerIcon>
              <GitGraph />
            </TabsTriggerIcon>
          </TabsTrigger>
          <TabsTrigger name="Configuration">
            <TabsTriggerIcon>
              <FileSliders />
            </TabsTriggerIcon>
          </TabsTrigger>
        </TabsList>
        <TabsContent name="Flow">
          <></>
          {/* <ReactFlowProvider>
            <Editor />
          </ReactFlowProvider> */}
        </TabsContent>
        <TabsContent name="Configuration">
          <ConfigProvider>
            <Configuration />
          </ConfigProvider>
        </TabsContent>
      </Tabs>
    </>
  );
}
