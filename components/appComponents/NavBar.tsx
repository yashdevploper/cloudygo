import React, { useState } from "react";
import Image from "next/image";
import { useCity } from "@/context/searchCityContext";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { useTheme } from "@/context/themeProvider";
import ThemeToggle from "./ThemeToggle";

const NavBar = () => {
  const { setCity, fetchWeatherData } = useCity();
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchInput.trim()) {
        setCity(searchInput.trim());
        fetchWeatherData(searchInput.trim());
      }
    }
  };

  const { theme } = useTheme();

  return (
    <nav className="flex items-center justify-between px-3 py-1 border-b border-gray-800 rounded sm:px-6">
      {/* Logo Section */}
      <Link href={"/"}>
        <div className="flex items-center space-x-2">
          <Image
            src={`${
              theme === "Dark"
                ? "/png/logos/logoDarkTheme.png"
                : "/png/logos/logoLightTheme.png"
            }`}
            alt="Application Logo"
            width={80}
            height={32}
            className="cursor-pointer transform hover:scale-105 transition duration-300 w-24 sm:w-[80px] sm:h-[72px]"
          />
        </div>
      </Link>

      {/* Search Bar Section */}
      <div className="flex-grow max-w-2xl mx-4 sm:mx-8">
        <input
          type="search"
          name="searchCity"
          id="searchCity"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearch}
          className={`w-full px-6 py-3 rounded-lg border border-gray-700 placeholder-gray-400 ${
            theme === "Dark" ? "text-white" : "text-black"
          } 
                   focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent
                   transition duration-200`}
          placeholder="Search city..."
        />
      </div>

      {/* Profile and Theme Section */}
      <div className="flex items-center space-x-6">
        <ThemeToggle />

        {/* Profile Icon*/}
        <Link href={"/profile"}>
          <div>
            <Avatar>
              <AvatarImage src="/png/profile.png" />
              <AvatarFallback>
                <div className=" h-full w-full bg-card/60 animate-pulse"></div>
              </AvatarFallback>
            </Avatar>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
