"use client";
import { Squash as Hamburger } from "hamburger-react";
import Image from "next/image";
import { NavigationData } from "@/data/SiteData";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserIcon from "../buttons/UserIcon";

export default function NHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const navRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (navRef.current && isOpen) {
      setNavHeight(navRef.current.scrollHeight);
    }
  }, [isOpen, navRef]);

  return (
    <motion.header
      initial={false}
      animate={{
        height: isOpen ? `${navHeight + 54}px` : "54px", // 64px is the closed header height
      }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="flex fixed top-0 w-screen items-center flex-col px-4 py-1 border-b bg-card/50 backdrop-blur-xl overflow-hidden z-20" // Prevent content overflow
    >
      <div className="flex items-center mt-0 md:mt-[8px] w-full justify-between">
        <div className="flex items-center gap-4">
          <a href="/" className="font-bold text-2xl">
            <Image
              src="/icon8.png"
              width={30}
              height={30}
              alt="icon"
              className="rounded-lg"
            />
          </a>
        </div>{" "}
        <div className="flex hidden md:block  items-center gap-6">
          {NavigationData.map((nav) => (
            <Link className="font-bold" key={nav.name} href={nav.href}>
              {nav.name}
            </Link>
          ))}
        </div>
        <div className="md:hidden">
          <Hamburger toggle={setIsOpen} toggled={isOpen} rounded size={20} />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            ref={navRef}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-col gap-4 pb-4 items-center justify-center"
          >
            {NavigationData.map((nav) => (
              <Link className="text-3xl" key={nav.name} href={nav.href}>
                {nav.name}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
