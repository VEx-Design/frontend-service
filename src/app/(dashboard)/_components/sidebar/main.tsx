import ProfilePicture from "@/features/auth/components/ProfilePicture";
import PageList from "./pagelist";
import currentUser from "@/features/auth/actions/user";

const Sidebar = async () => {
  const user = await currentUser();

  const email = user?.email;

  return (
    <aside className="w-full h-full border-r px-2 flex flex-col space-y-3 items-center md:items-start">
      <div className="flex items-center gap-2 p-2">
        <ProfilePicture />
        <div className=" hidden md:block md:w-[130px] overflow-hidden text-ellipsis whitespace-nowrap">
          <div className="text-sm ">{user?.name}</div>
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
