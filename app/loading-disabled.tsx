"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function Loading() {
  return (
    <AnimatePresence>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 1.0 }}
      >
        <div className="h-screen w-screen bg-gradient-to-r  animate-spin-around">
          <div className="grid place-content-center h-[90vh]">
            <div className="flex items-center flex-col gap-2">
              <span className="loading bg-primary loading-dots loading-lg scale-150"></span>
              <p className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                devnotes.me
              </p>
            </div>
          </div>
        </div>
      </motion.main>
    </AnimatePresence>
  );
}
