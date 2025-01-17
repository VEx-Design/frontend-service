"use server";

import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Clear the HttpOnly cookie by setting its expiration date to the past
  res.setHeader(
    "Set-Cookie",
    "your-cookie-name=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict"
  );

  res.status(200).json({ message: "Logged out successfully" });
}
