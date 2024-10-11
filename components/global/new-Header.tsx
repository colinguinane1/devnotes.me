"use client";
import { Squash as Hamburger } from "hamburger-react";
import Image from "next/image";
import { NavigationData } from "@/data/SiteData";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const navRef = useRef(null);

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
      className="flex items-center flex-col px-4 py-1 border-b bg-card/20 overflow-hidden" // Prevent content overflow
    >
      <div className="flex items-center w-full justify-between">
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
