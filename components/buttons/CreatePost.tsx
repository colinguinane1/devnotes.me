import { PlusCircleIcon } from "lucide-react";
import { Button } from "../ui/button";
import { BsPencilSquare } from "react-icons/bs";
import Link from "next/link";

export default function CreatePost() {
  return (
    <Link href="/write/advanced">
      <Button className="fixed bottom-4 shadow-blue-500 shadow-2xl rounded-full w-14 h-14 flex items-center justify-center right-4 ">
        <BsPencilSquare size={50} />
      </Button>
    </Link>
  );
}
