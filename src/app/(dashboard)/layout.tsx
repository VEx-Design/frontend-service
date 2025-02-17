import { auth } from "@clerk/nextjs/server";
import Navbar from "./_components/Navbar";
import Sidebar from "./_components/sidebar/main";
import { Suspense } from "react";
import { Loading } from "@/src/components/loading";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { userId } = await auth();

  // if (!userId) {
  //   return <div>Not Signed In - Please Sign In (in Layout Nest)</div>;
  // }

  return (
    <Suspense fallback={<Loading />}>
      <section className="h-full flex flex-col">
        <div className="flex-none">
          <Navbar />
        </div>
        <div className="flex flex-auto">
          <div className="pt-5 flex-none">
            <Sidebar />
          </div>
          <div className="flex flex-1 pt-5 px-8">{children}</div>
        </div>
      </section>
    </Suspense>
  );
}
