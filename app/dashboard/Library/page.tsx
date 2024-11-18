import { auth, currentUser } from "@clerk/nextjs/server";
import React from "react";

export default async function Home() {
  const user = await currentUser();
  // console.log(user);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      Home
      <div>username : {user?.username}</div>
      <div>firstName : {user?.firstName}</div>
      <div>lastName : {user?.lastName}</div>
      <div>
        <img src={user?.imageUrl} alt="profile" />
      </div>
      <div>Email : {user?.emailAddresses[0].emailAddress}</div>
    </div>
  );
}
