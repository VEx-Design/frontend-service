"use client";
import axios from "axios";

interface Project {
  name: string;
}

export function CreateProject(project: Project) {
  axios
    .post("/api/v1/project", project)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}
