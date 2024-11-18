import { auth } from "@clerk/nextjs/server";
import React from "react";

export default async function Dashboard() {
  const { userId } = await auth();
  console.log(userId);
  // if (!userId) {
  //   return <div>Not SignIn Go Auth</div>;
  // }
  return <div>Dashboard</div>;
}
