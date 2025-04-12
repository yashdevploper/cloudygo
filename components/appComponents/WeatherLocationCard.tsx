"use client";

import {
  Cloud,
  Droplets,
  MapPin,
  Thermometer,
  ThermometerSun,
  Wind,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface WeatherLocationCardProps {
  district: string;
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherType: string;
}

export function WeatherLocationCard({
  district,
  city,
  country,
  temperature,
  feelsLike,
  humidity,
  windSpeed,
  weatherType,
}: WeatherLocationCardProps) {
  return (
    <Card className="overflow-hidden max-w-full">
      <CardHeader className="bg-primary/10 pb-1">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold">{city}</CardTitle>
            <CardDescription className="flex items-center gap-1 text-sm">
              <MapPin className="h-3.5 w-3.5" />
              {district}, {country}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-background px-2 py-1 text-xs font-medium shadow-sm">
            <Cloud className="h-3.5 w-3.5" />
            {weatherType}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-[20px]">
          <div className="mb-4 flex items-baseline justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="h-6 w-6 text-primary" />
              <span className="text-3xl font-bold">{temperature}°</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <ThermometerSun className="h-4 w-4" />
              Feels like {feelsLike}°
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-sm font-medium">Humidity</div>
                <div className="text-xl font-semibold">{humidity}%</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-sm font-medium">Wind</div>
                <div className="text-xl font-semibold">{windSpeed} km/h</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
