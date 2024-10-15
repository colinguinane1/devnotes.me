"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ProgressBar = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const documentHeight =
      document.documentElement.scrollHeight - window.innerHeight - 600;

    if (scrollY > 400) {
      const scrolled = ((scrollY - 400) / (documentHeight - 400)) * 100;
      setScrollPercentage(scrolled);
    } else {
      setScrollPercentage(0); // Reset the progress before 400px
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="p-4">
      <AnimatePresence>
        {scrollPercentage > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 left-0 w-full px-4"
          >
            <div className="w-full bg-gray-500/80 backdrop-blur-xl h-[6px] rounded-full">
              <motion.div
                style={{ width: `${scrollPercentage}%` }}
                className={`h-[6px] rounded-full backdrop-blur-xl ${
                  scrollPercentage >= 100 ? "bg-green-500/80" : "bg-primary/80"
                }`}
              />
            </div>
          </motion.div>
        )}{" "}
      </AnimatePresence>
    </main>
  );
};

export default ProgressBar;
