import { auth } from "@clerk/nextjs/server";
import Header from "./_components/header";
import Sidebar from "./_components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    return <div>Not Signed In - Please Sign In (in Layout Nest)</div>;
  }

  return (
    <section className="min-h-screen flex flex-col">
      <div className="flex-none">
        <Header />
      </div>
      <div className="flex flex-auto">
        <div className="pt-5 flex-none">
          <Sidebar />
        </div>
        <div className="pt-5 flex-1 px-8">{children}</div>
      </div>
    </section>
  );
}
