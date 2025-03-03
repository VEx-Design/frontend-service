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
import { Airplay, FileSliders, GitGraph, Grid2X2Plus , SquareDashed, SquareMousePointer} from "lucide-react";
import { useProject } from "../../contexts/ProjectContext";
import Editor from "../Editor";
import Configuration from "../Configuration";
import { EditorProvider } from "../../contexts/EditorContext";
import Execution from "../Execution";
import { ExecutionProvider } from "../../contexts/Execution/ExecutionContext";
import { ConfigProvider } from "../../contexts/Configuration/ConfigContext";
import Box from "../Box";
import { BoxProvider } from "../../contexts/BoxContext";
import FitObject from "@/src/app/fitobject/page";
import { GiTable } from "react-icons/gi";


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
          <ConfigProvider>
            <Configuration />
          </ConfigProvider>
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
          <BoxProvider>
            <FitObject />
          </BoxProvider>
        </TabsContent>
      </Tabs>
    </>
  );
}
