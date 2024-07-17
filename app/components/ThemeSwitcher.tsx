"use client";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { BiSun } from "react-icons/bi";
import { BiMoon } from "react-icons/bi";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [themeDropdown, setThemeDropdown] = useState(false);
  const [justClicked, setJustClicked] = useState(false);
  const dropdownRef = useRef(null);

  const handleChangeTheme = (selectedTheme: any) => {
    setTheme(selectedTheme);
  };

  return (
    <div className="flex items-center p-2 rounded-md  bg-white w-fit h-fit">
      {theme === "light" ? (
        <button onClick={() => handleChangeTheme("dark")}>
          <BiMoon />
        </button>
      ) : (
        <button onClick={() => handleChangeTheme("dark")}>
          <BiSun />
        </button>
      )}
    </div>
  );
}
