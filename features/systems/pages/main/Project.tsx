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
import { Airplay, FileSliders, GitGraph, SquareDashed } from "lucide-react";
import { useProject } from "../../contexts/ProjectContext";
import Editor from "../Editor";
import Configuration from "../Configuration";
import { ConfigProvider } from "../../contexts/ConfigContext";
import { EditorProvider } from "../../contexts/EditorContext";
import Execution from "../Execution";
import { ExecutionProvider } from "../../contexts/ExecutionContext";
import Box from "../Box";

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
          <TabsTrigger name="Execution">
            <TabsTriggerIcon>
              <Airplay />
            </TabsTriggerIcon>
          </TabsTrigger>
          <TabsTrigger name="Box">
            <TabsTriggerIcon>
              <SquareDashed />
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
          <EditorProvider>
            <Box />
          </EditorProvider>
        </TabsContent>
      </Tabs>
    </>
  );
}
