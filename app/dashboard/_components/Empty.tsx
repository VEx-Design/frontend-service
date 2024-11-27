import React from "react";
import Image from "next/image";
import EmptyImage from "@/public/EmptyImages/oops-404-error-with-a-broken-robot/cuate.png";

export default function Empty() {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <Image src={EmptyImage} alt="EmptyProject" height={300} width={300} />
      <span>
        Your project library is empty. Start by creating a new project or
        importing one from the community.
      </span>
    </div>
  );
}
