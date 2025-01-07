import SignIn from "@/features/auth/components/SignIn";

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
      <SignIn />
    </div>
  );
}
