"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Subscription } from "@prisma/client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface FollowingDrawerProps {
  authorFollowers: any;
}

export default function FollowingDrawer({
  authorFollowers,
}: FollowingDrawerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size={"icon"}>
          Followers
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Followers</DrawerTitle>
          <DrawerDescription>{authorFollowers.subscriber}</DrawerDescription>
        </DrawerHeader>
        <h1>test</h1>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
