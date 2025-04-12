"use client";

import React, { useEffect } from "react";
import { LineDoteChart } from "@/components/ui/lineChartCustomDots";
import NavBar from "@/components/appComponents/NavBar";
import { WeatherLocationCard } from "@/components/appComponents/WeatherLocationCard";
import { WeatherSunCard } from "@/components/appComponents/WeatherSunCard";
import { useCity } from "@/context/searchCityContext";
import { Heart, MapPin } from "lucide-react";

export default function WeatherDashboard() {
  const {
    city,
    weatherData,
    sunData,
    isLoading,
    error,
    fetchWeatherData,
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  } = useCity();

  // Fetch default weather data on first load
  useEffect(() => {
    if (!weatherData && !isLoading) {
      fetchWeatherData("New York"); // Default city
    }
  }, [weatherData, isLoading, fetchWeatherData]);

  // Handle adding/removing from favorites
  const handleFavoriteToggle = () => {
    if (weatherData) {
      if (isFavorite(weatherData.city)) {
        removeFromFavorites(weatherData.city);
      } else {
        addToFavorites(weatherData.city);
      }
    }
  };

  // Handle clicking on a favorite city
  const handleFavoriteClick = (favoriteCity: string) => {
    fetchWeatherData(favoriteCity);
  };

  return (
    <div className="w-full min-h-screen radialBg">
      <NavBar />
      <div className=" px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
        <main className="max-w-7xl mx-auto space-y-6 sm:space-y-8 mt-6">
          <section className="favorites">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 px-1">
              Favorites
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {favorites.length > 0 ? (
                favorites.map((favoriteCity) => (
                  <div
                    key={favoriteCity}
                    onClick={() => handleFavoriteClick(favoriteCity)}
                    className="h-24 bg-card rounded-lg shadow flex flex-col items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors p-3"
                  >
                    <div className="flex items-center mb-2">
                      <MapPin className="w-4 h-4 mr-1 text-primary" />
                      <span className="font-medium truncate">
                        {favoriteCity}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Click to view
                    </span>
                  </div>
                ))
              ) : (
                <>
                  <div className="h-24 bg-card/60 rounded-lg shadow flex items-center justify-center text-muted-foreground">
                    No favorites yet
                  </div>
                  <div className="h-24 bg-card/60 rounded-lg shadow hidden sm:flex items-center justify-center text-muted-foreground">
                    Search for cities to add
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="my-location space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center">
                {isLoading ? "Loading..." : weatherData?.city || "My Location"}
                {weatherData?.country && (
                  <span className="text-sm font-normal ml-2 text-muted-foreground">
                    {weatherData.country}
                  </span>
                )}
              </h2>

              {!isLoading && weatherData && (
                <button
                  onClick={handleFavoriteToggle}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isFavorite(weatherData.city)
                      ? "bg-pink-500/20 text-pink-600 hover:bg-pink-500/30"
                      : "bg-card hover:bg-primary/10"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isFavorite(weatherData.city)
                        ? "fill-pink-500 text-pink-500"
                        : "text-muted-foreground"
                    }`}
                  />
                  {isFavorite(weatherData.city)
                    ? "Remove from favorites"
                    : "Add to favorites"}
                </button>
              )}
            </div>

            {error ? (
              <div className="p-6 bg-destructive/10 rounded-lg text-center">
                <p className="text-destructive font-medium">{error}</p>
                <button
                  onClick={() => fetchWeatherData(city || "New York")}
                  className="mt-2 text-sm px-3 py-1 rounded-full bg-card hover:bg-primary/10 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Weather cards column */}
                <div className="lg:col-span-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                  {isLoading ? (
                    <>
                      <div className="h-64 bg-card/60 rounded-lg shadow animate-pulse"></div>
                      <div className="h-64 bg-card/60 rounded-lg shadow animate-pulse"></div>
                    </>
                  ) : (
                    <>
                      {weatherData && <WeatherLocationCard {...weatherData} />}
                      {sunData && <WeatherSunCard {...sunData} />}
                    </>
                  )}
                </div>

                {/* Chart column */}
                <div className="lg:col-span-2 bg-card rounded-lg overflow-hidden shadow">
                  {isLoading ? (
                    <div className="h-80 w-full bg-card/60 animate-pulse flex items-center justify-center">
                      <p className="text-muted-foreground">
                        Loading chart data...
                      </p>
                    </div>
                  ) : (
                    <LineDoteChart />
                  )}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
