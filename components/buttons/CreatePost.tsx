import { PlusCircleIcon } from "lucide-react";
import { Button } from "../ui/button";

export default function CreatePost() {
  return (
    <Button className="absolute bottom-4 right-4 shadow-2xl" size={"icon"}>
      <PlusCircleIcon size={50} />
    </Button>
  );
}
