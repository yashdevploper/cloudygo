"use client";

import React, { useEffect, useState } from "react";
import { Clock, MapPin, Thermometer, Globe } from "lucide-react";
import NavBar from "@/components/appComponents/NavBar";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/context/themeProvider";
import axios from "axios";

export default function WeatherHistoryPage() {
  interface HistoryItem {
    coordinates: {
      type: "Point";
      coordinates: [number, number];
    };
    city: string;
    temperature: number;
    timestamp: Date;
    _id: string;
  }

  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false)
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get("/api/user/history");
        setHistoryData(response.data.history);
        setIsLoading(false)

      } catch (error) {
        setError(true)
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div
      className={`w-full min-h-screen ${
        theme === "Dark" ? "radialBg" : "bg-light-gradient"
      }`}
    >
      <NavBar />
      <div className="px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
        <main className="max-w-7xl mx-auto space-y-6 sm:space-y-8 mt-6">
          <section className="weather-history">
            <div className="flex items-center justify-between px-1 mb-4">
              <h2 className="text-xl sm:text-2xl font-bold">Weather History</h2>
            </div>

            {error ? (
              <div className="p-6 bg-destructive/10 rounded-lg text-center">
                <p className="text-destructive font-medium">{error}</p>
                <button
                  onClick={() => {
                    /* Add retry logic */
                  }}
                  className="mt-2 text-sm px-3 py-1 rounded-full bg-card hover:bg-primary/10 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                  Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <Card
                        key={index}
                        className="p-4 h-40 bg-card/60 animate-pulse"
                      />
                    ))
                ) : historyData.length > 0 ? (
                  historyData.map((entry) => (
                    <Card
                      key={entry._id}
                      className="p-4 bg-card hover:bg-card/80 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-semibold">
                            {entry.city}
                            {entry.city && (
                              <span className="text-sm text-muted-foreground ml-1">
                                ({entry.city})
                              </span>
                            )}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1 text-primary">
                          <Thermometer className="w-5 h-5" />
                          <span className="font-medium">
                            {entry.temperature}°C
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {new Date(entry.timestamp).toLocaleDateString()}
                          </span>
                          <span className="text-muted-foreground">
                            {new Date(entry.timestamp).toLocaleTimeString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Lat: {entry.coordinates.coordinates[0].toFixed(4)}
                          </span>
                          <span className="text-muted-foreground">
                            Lon: {entry.coordinates.coordinates[1].toFixed(4)}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full p-6 text-center text-muted-foreground">
                    No weather history available. Your past searches will appear
                    here.
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
