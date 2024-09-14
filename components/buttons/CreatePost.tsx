import { PlusCircleIcon } from "lucide-react";
import { Button } from "../ui/button";
import { BsPencilSquare } from "react-icons/bs";
import Link from "next/link";

export default function CreatePost() {
  return (
    <Link href="/write/advanced">
      <Button className="fixed bottom-4 right-4 shadow-2xl" size={"icon"}>
        <BsPencilSquare size={20} />
      </Button>
    </Link>
  );
}
