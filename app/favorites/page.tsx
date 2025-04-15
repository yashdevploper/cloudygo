"use client";

import React from "react";
import { MapPin, Heart, HeartOff } from "lucide-react";
import NavBar from "@/components/appComponents/NavBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/themeProvider";

// Type definition for favorites data
interface Favorite {
  cityName: string;
}

export default function FavoritesPage() {
  const { theme } = useTheme();

  // Sample data - replace with your actual data fetching
  const favorites: Favorite[] = [
    { cityName: "London" },
    { cityName: "New York" },
    { cityName: "Tokyo" },
    { cityName: "Paris" },
    { cityName: "Dubai" },
  ];

  const isLoading = false; // Replace with actual loading state
  const error = null;      // Replace with actual error state

  // UI handlers (to be implemented)
  const handleRemoveFavorite = (cityName: string) => {
    console.log("Remove favorite:", cityName);
  };

  const handleViewCity = (cityName: string) => {
    console.log("View city:", cityName);
  };

  return (
    <div className={`w-full min-h-screen ${theme === "Dark" ? "radialBg" : "bg-light-gradient"}`}>
      <NavBar />
      <div className="px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
        <main className="max-w-7xl mx-auto space-y-6 sm:space-y-8 mt-6">
          <section className="favorites-section">
            <div className="flex items-center justify-between px-1 mb-4">
              <h2 className="text-xl sm:text-2xl font-bold">Favorite Cities</h2>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {favorites.length} saved cities
                </span>
              </div>
            </div>

            {error ? (
              <div className="p-6 bg-destructive/10 rounded-lg text-center">
                <p className="text-destructive font-medium">{error}</p>
                <Button
                  variant="ghost"
                  className="mt-2"
                  onClick={() => {/* Add retry logic */}}
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {isLoading ? (
                  Array(4).fill(0).map((_, index) => (
                    <Card key={index} className="p-4 h-32 bg-card/60 animate-pulse" />
                  ))
                ) : favorites.length > 0 ? (
                  favorites.map((favorite) => (
                    <Card 
                      key={favorite.cityName}
                      className="p-4 bg-card hover:bg-card/80 transition-colors group relative"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-6 h-6 text-primary flex-shrink-0" />
                          <div>
                            <h3 className="text-lg font-semibold truncate">
                              {favorite.cityName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Last checked: 2h ago
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive/80 hover:text-destructive cursor-pointer"
                          onClick={() => handleRemoveFavorite(favorite.cityName)}
                        >
                          <HeartOff className="w-5 h-5" />
                        </Button>
                      </div>

                      <div className="mt-4 flex gap-2 ">
                        <Button
                          variant="outline"
                          className="w-full cursor-pointer"
                          onClick={() => handleViewCity(favorite.cityName)}
                        >
                          View Weather
                        </Button>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full p-8 text-center space-y-4">
                    <div className="mx-auto w-fit p-4 bg-card rounded-full">
                      <Heart className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">No Favorites Yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Add cities to your favorites by clicking the heart icon
                      on weather cards. Your saved locations will appear here.
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}