import React, { useState } from "react";
import Image from "next/image";
import { useCity } from "@/context/searchCityContext";
import Link from "next/link";

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

  return (
    <nav className="flex items-center justify-between px-6 py-1 border-b border-gray-800 rounded sticky">
      {/* Logo Section */}
      <Link href={"/"}>
        <div className="flex items-center space-x-2">
          <Image
            src="/png/logo.png"
            alt="Application Logo"
            width={80}
            height={32}
            className="cursor-pointer transform hover:scale-105 transition duration-300 w-14 sm:w-[80px] sm:h-[72px]"
          />
        </div>
      </Link>

      {/* Search Bar Section */}
      <div className="flex-grow max-w-2xl mx-8">
        <input
          type="search"
          name="searchCity"
          id="searchCity"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearch}
          className="w-full px-6 py-3 rounded-lg border border-gray-700 text-white placeholder-gray-400 
                   focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent
                   transition duration-200"
          placeholder="Search city..."
        />
      </div>

      {/* Profile and Theme Section */}
      <div className="flex items-center space-x-6">
        <button className="p-2 cursor-pointer rounded-full hover:rotate-90 transition duration-200">
          <Image
            src="/lightMod.svg"
            alt="Theme toggle"
            width={24}
            height={24}
            sizes="(max-width: 640px) 60px, 80px"
            className="w-[44px] h-[34px] sm:w-[24px] sm:h-[24px]"
          />
        </button>

        {/* Profile Icon*/}
        <Link href={"/profile"}>
          <div>
            <Image
              src="/png/profile.png"
              width={40}
              height={40}
              sizes="(max-width: 640px) 60px, 80px"
              alt="Profile"
              className="rounded-full bg-gray-700 hover:bg-gray-600 cursor-pointer transition duration-200 w-[50px] h-[24px] sm:w-[40px] sm:h-[40px]"
            />
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
