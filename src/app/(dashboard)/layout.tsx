import Navbar from "./_components/Navbar";
import Sidebar from "./_components/sidebar/main";
import { Suspense } from "react";
import { Loading } from "@/src/components/loading";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<Loading />}>
      <section className="h-full flex flex-col">
        <div className="flex-none">
          <Navbar />
        </div>
        <div className="flex flex-auto">
          <div className="pt-5 flex-none w-[15%]">
            <Sidebar />
          </div>
          <div className="flex flex-1 pt-5 px-8">{children}</div>
        </div>
      </section>
    </Suspense>
  );
}
