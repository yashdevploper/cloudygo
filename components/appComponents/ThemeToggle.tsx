import React from "react";
import { useTheme } from "@/context/themeProvider";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "Dark" ? "Light" : "Dark")}
      className="p-2 cursor-pointer rounded-full "
    >
      {theme === "Dark" ? (
        <Avatar className="w-[30px] hover:rotate-90  transition duration-200">
          <AvatarImage src="/lightMod.svg" />
          <AvatarFallback>
            <div className=" h-full w-full bg-card/60 animate-pulse"></div>
          </AvatarFallback>
        </Avatar>
      ) : (
        <Avatar className="w-[24px] rotate-12 hover:-rotate-z-[20deg]  transition duration-200">
          <AvatarImage src="/darkMod.svg" />
          <AvatarFallback>
            <div className=" h-full w-full bg-card/60 animate-pulse"></div>
          </AvatarFallback>
        </Avatar>
      )}
    </button>
  );
};

export default ThemeToggle;
