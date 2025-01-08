import React from "react";
import Image from "next/image";
import Logo from "@/public/images/Logo.png";

export default async function Header() {
  // const userId = await auth();

  // if (!userId) {
  //   return <div>Error Auth in Header</div>;
  // }

  // const user = await currentUser();

  return (
    <div className="bg-C1 text-M1 flex justify-between px-10 py-4 h-20">
      <div className="flex gap-3 items-center">
        <a href="#" className="flex justify-center items-center">
          <Image src={Logo} alt="Logo" className="w-auto h-7" priority />
        </a>
        <p className="font-bold text-3xl">VExDesign</p>
      </div>
      <div className="flex items-center gap-3 ">
        {/* <div className="text-sm hidden md:block">
          {user?.firstName} {user?.lastName?.charAt(0)} .
        </div> */}
        {/* <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "w-12 h-12",
            },
          }}
        /> */}
      </div>
    </div>
  );
}
