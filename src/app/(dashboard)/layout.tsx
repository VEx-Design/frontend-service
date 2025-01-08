import Navbar from "./_components/Navbar";
import Sidebar from "./_components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="h-screen flex flex-col">
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
  );
}
