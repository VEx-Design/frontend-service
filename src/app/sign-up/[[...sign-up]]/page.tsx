import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div
      className="flex justify-center items-center h-screen"
      style={{
        backgroundImage: `url(/images/Overview.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <SignUp />
    </div>
  );
}
