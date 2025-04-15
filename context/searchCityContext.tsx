"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";

type CityContextType = {
  city: string;
  setCity: (city: string) => void;
  weatherData: any | null;
  sunData: any | null;
  isLoading: boolean;
  error: string | null;
  fetchWeatherData: (cityName: string) => Promise<void>;
  favorites: string[];
  addToFavorites: (cityName: string) => void;
  removeFromFavorites: (cityName: string) => void;
  isFavorite: (cityName: string) => boolean;
};

const CityContext = createContext<CityContextType | undefined>(undefined);

// Helper to get favorites from localStorage
const getFavoritesFromStorage = (): string[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("weatherFavorites");
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

export const CityProvider = ({ children }: { children: ReactNode }) => {
  const [city, setCity] = useState<string>("");
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [sunData, setSunData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on initial render
  useEffect(() => {
    setFavorites(getFavoritesFromStorage());
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined" && favorites.length > 0) {
      localStorage.setItem("weatherFavorites", JSON.stringify(favorites));
    }
  }, [favorites]);

  const addToFavorites = (cityName: string) => {
    if (!cityName) return;

    if (!favorites.includes(cityName)) {
      setFavorites([...favorites, cityName]);
    }
  };

  const removeFromFavorites = (cityName: string) => {
    setFavorites(favorites.filter((fav) => fav !== cityName));
  };

  const isFavorite = (cityName: string): boolean => {
    return favorites.includes(cityName);
  };

  const fetchWeatherData = async (cityName: string) => {
    if (!cityName) return;

    setIsLoading(true); 
    setError(null);

    try {
      const response = await axios.get("/api/weather", {
        params: { city: cityName },
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data && response.data.data) {
        const data = response.data.data;

        // Set weather data
        setWeatherData({
          district: "",
          city: data.name || cityName,
          country: data.sys?.country || "Unknown",
          temperature: Math.round(data.main?.temp) || 0,
          feelsLike: Math.round(data.main?.feels_like) || 0,
          humidity: data.main?.humidity || 0,
          windSpeed: Math.round(data.wind?.speed * 3.6) || 0, // Convert m/s to km/h
          weatherType: data.weather?.[0]?.main || "Unknown",
        });

        // Calculate sun data
        if (data.sys?.sunrise && data.sys?.sunset) {
          const sunriseTimestamp = data.sys.sunrise * 1000;
          const sunsetTimestamp = data.sys.sunset * 1000;

          const sunriseDate = new Date(sunriseTimestamp);
          const sunsetDate = new Date(sunsetTimestamp);

          const dayLengthMins =
            (sunsetTimestamp - sunriseTimestamp) / (1000 * 60);
          const dayPercentage = Math.round((dayLengthMins / (24 * 60)) * 100);

          setSunData({
            city: data.name || cityName,
            sunrise: sunriseDate.toISOString(),
            sunset: sunsetDate.toISOString(),
            daylight: dayPercentage,
            currentTime: new Date().toISOString(),
            date: new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
          });
        }
      }
    } catch (err: any) {
      console.error("Error fetching weather data:", err);
      setError(err.message || "Failed to fetch weather data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CityContext.Provider
      value={{
        city,
        setCity,
        weatherData,
        sunData,
        isLoading,
        error,
        fetchWeatherData,
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCity = (): CityContextType => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error("useCity must be used within a CityProvider");
  }
  return context;
};
