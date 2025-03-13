"use client";

import React from "react";
import ProjectNavbar from "../../components/ProjectNavbar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TabsTriggerIcon,
} from "@/components/Tabs";
import {
  Airplay,
  FileSliders,
  GitGraph,
  SquareMousePointer,
} from "lucide-react";
import { useProject } from "../../contexts/ProjectContext";
import Editor from "../Editor";
import Configuration from "../Configuration";
import { EditorProvider } from "../../contexts/EditorContext";
import Execution from "../Execution";
import { ExecutionProvider } from "../../contexts/Execution/ExecutionContext";
import Box from "../Box";
import { BoxProvider } from "../../contexts/BoxContext";
import { GiTable } from "react-icons/gi";
import { ConfigTypeProvider } from "../../contexts/Configuration/ConfigTypeContext";
import { CanvasProvider } from "../../contexts/CanvasContext";
import TableSimulation from "../../components/Table/page";

export default function Project() {
  const { projName, onSave, savePending, setIsTriggered } = useProject();

  return (
    <>
      <ProjectNavbar
        title={projName}
        onSave={onSave}
        savePending={savePending}
      />
      <Tabs type="side" onTabChange={() => setIsTriggered(true)}>
        <TabsList>
          <TabsTrigger name="Flow">
            <TabsTriggerIcon>
              <GitGraph />
            </TabsTriggerIcon>
          </TabsTrigger>
          <TabsTrigger name="Execution">
            <TabsTriggerIcon>
              <Airplay />
            </TabsTriggerIcon>
          </TabsTrigger>
          <TabsTrigger name="Configuration">
            <TabsTriggerIcon>
              <FileSliders />
            </TabsTriggerIcon>
          </TabsTrigger>
          <TabsTrigger name="Box">
            <TabsTriggerIcon>
              <SquareMousePointer />
            </TabsTriggerIcon>
          </TabsTrigger>
          <TabsTrigger name="Table">
            <TabsTriggerIcon>
              <GiTable />
            </TabsTriggerIcon>
          </TabsTrigger>
        </TabsList>
        <TabsContent name="Flow">
          <EditorProvider>
            <Editor />
          </EditorProvider>
        </TabsContent>
        <TabsContent name="Configuration">
          <ConfigTypeProvider>
            <Configuration />
          </ConfigTypeProvider>
        </TabsContent>
        <TabsContent name="Execution">
          <ExecutionProvider>
            <Execution />
          </ExecutionProvider>
        </TabsContent>
        <TabsContent name="Box">
          <BoxProvider>
            <Box />
          </BoxProvider>
        </TabsContent>
        <TabsContent name="Table">
          <CanvasProvider>
            <TableSimulation />
          </CanvasProvider>
        </TabsContent>
      </Tabs>
    </>
  );
}
