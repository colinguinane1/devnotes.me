"use client";
import { useEffect, useState } from "react";

const ProgressBar = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const documentHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (scrollY / documentHeight) * 100;
    setScrollPercentage(scrolled);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{ width: `${scrollPercentage}%` }}
      className={`fixed shadow-2xl left-0  h-[2px]  z-50 bg-primary`}
    />
  );
};

export default ProgressBar;
