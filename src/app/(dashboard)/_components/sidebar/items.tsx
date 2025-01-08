import Link from "next/link";
import Image from "next/image";

interface ItemsProps {
  href: string;
  icon: string;
  title: string;
  isActive: boolean;
  onClick: (href: string) => void;
}

const Items = ({ href, icon, title, isActive, onClick }: ItemsProps) => {
  return (
    <Link href={href}>
      <li
        className={`w-full p-2 hover:bg-B1 hover:rounded-md flex items-end justify-start gap-3 ${
          isActive ? "bg-B1 rounded-md" : ""
        }`}
        onClick={() => onClick(href)}
      >
        <div className="aspect-square w-6 h-6">
          <Image src={icon} alt={title} width={24} height={24} />
        </div>
        <span className="hidden md:block">{title}</span>
      </li>
    </Link>
  );
};

export default Items;
