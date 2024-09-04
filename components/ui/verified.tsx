"use client";
import { AiTwotoneCheckCircle } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function VerifiedUser() {
  const [hover, setHover] = useState(false);

  return (
    <div className="flex flex-col items-center group justify-center">
      <AiTwotoneCheckCircle
        className="group"
        color="blue"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      />

      <AnimatePresence>
        {hover && (
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2, type: "spring" }}
            className="font-normal absolute border mb-20 bg-card p-2 rounded-md text-base"
          >
            This user has been verified by devnotes
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
