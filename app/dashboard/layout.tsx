import { auth } from "@clerk/nextjs/server";
import Header from "../components/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    return <div>Not Signed In - Please Sign In</div>;
  }
  return (
    <section className="dashboard-layout">
      <Header />
      <div>{children}</div>
    </section>
  );
}
