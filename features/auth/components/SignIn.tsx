"use client";

import Button from "@/components/Button";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function SignIn() {
  const [redirectTo, setRedirectTo] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirectToParam = params.get("redirect_to");
    setRedirectTo(redirectToParam || "");
  }, []);

  const googleLogin = () => {
    if (redirectTo !== "")
      window.location.href = `http://localhost:6740/auth/google?redirect_to=${redirectTo}`;
    else window.location.href = `http://localhost:6740/auth/google`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-0 flex justify-center items-center z-50">
      <div className="relative bg-white rounded-lg shadow-lg min-w-[300px] max-w-[500px] md:min-w-[450px] py-8">
        <div className="text-center pb-8">
          <p className="text-lg font-semibold">Sign in to VEx Design</p>
          <p className="text-sm font-thin text-gray-500">
            Welcome back! Please sign in to continue
          </p>
        </div>
        <div className="flex justify-center">
          <Button handleButtonClick={googleLogin}>
            <div className="flex justify-center items-center gap-4">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                alt="Google Icon"
                width={30}
                height={30}
                priority
              />
              <p>Sign in with google</p>
            </div>
          </Button>
        </div>
        <div className="flex text-sm gap-1 justify-center mt-6">
          <p className="text-gray-500">{"Don't have an account?"}</p>
          <a href="#">Sign up</a>
        </div>
      </div>
    </div>
  );
}
