import PageList from "./pagelist";
import { auth, currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

const Sidebar = async () => {
  const userId = await auth();
  if (!userId) {
    return <div>Error Auth in Sidebar main.tsx</div>;
  }

  const user = await currentUser();

  const email = user?.emailAddresses[0]?.emailAddress;

  return (
    <aside className="md:w-[200px] h-full border-r px-2 flex flex-col space-y-3 items-center md:items-start">
      <div className="flex items-center gap-2 p-2">
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "w-9 h-9",
            },
          }}
        />
        <div className=" hidden md:block md:w-[130px] overflow-hidden text-ellipsis whitespace-nowrap">
          <div className="text-sm ">
            {user?.firstName} {user?.lastName?.charAt(0)}
          </div>
          <div className="text-xs text-ChildText ">
            {email
              ? `${email.split("@")[0].slice(0, 5)}...@${email.split("@")[1]}`
              : "No email"}
          </div>
        </div>
      </div>
      <PageList />
    </aside>
  );
};

export default Sidebar;
