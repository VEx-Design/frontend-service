"use client";

import Image from "next/image";
import React from "react";
import { useUser } from "../provider/AuthProvider";

export default function ProfilePicture() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>
    );
  }

  return (
    <>
      {user?.picture ? (
        <div>
          <Image
            src={user.picture}
            alt="Profile Picture"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      ) : (
        <div>
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/7/7c/User_font_awesome.svg"
            alt="Profile Picture"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      )}
    </>
  );
}
