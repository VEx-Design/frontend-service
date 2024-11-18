import React from "react";
import Logo from "../assets/Logo.png";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function header() {
  const userId = await auth();

  if (!userId) {
    return <div>Error Auth in header</div>;
  }

  const user = await currentUser();

  return (
    <div className="bg-C1 text-M1 flex justify-between px-10 py-4 h-20">
      <div className="flex gap-3 items-center">
        <a href="#" className="flex justify-center items-center">
          <Image src={Logo} alt="Logo" height={24} width={43} />
        </a>
        <p className="font-bold text-3xl">VExDesign</p>
      </div>
      <div className="flex items-center gap-3 ">
        <div>
          {user?.firstName} {user?.lastName}
        </div>
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "w-12 h-12",
            },
          }}
        />
      </div>
    </div>
  );
}
