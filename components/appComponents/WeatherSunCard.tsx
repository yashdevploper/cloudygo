"use client";

import { Sun, Sunrise, Sunset } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";

interface WeatherSunCardProps {
  city: string;
  sunrise: string;
  sunset: string;
  daylight: number;
  currentTime: string;
  date: string;
}

export function WeatherSunCard({
  city,
  sunrise,
  sunset,
  daylight,
  currentTime,
  date,
}: WeatherSunCardProps) {
  const chartData = [
    { name: "Daylight", value: daylight },
    { name: "Night", value: 100 - daylight },
  ];

  const chartConfig = {
    daylight: {
      label: "Daylight",
      color: "hsl(43, 96%, 56%)",
    },
    night: {
      label: "Night",
      color: "hsl(215, 16%, 47%)",
    },
  } satisfies ChartConfig;

  // Calculate if it's currently day or night
  const currentHour = new Date(currentTime).getHours();
  const sunriseHour = new Date(sunrise).getHours();
  const sunsetHour = new Date(sunset).getHours();
  const isDaytime = currentHour >= sunriseHour && currentHour < sunsetHour;

  return (
    <Card className="overflow-hidden max-w-full">
      <CardHeader className="bg-primary/10 pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Sun Schedule</CardTitle>
            <CardDescription className="flex items-center gap-1 text-sm">
              {city} • {date}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-background px-2 py-1 text-xs font-medium shadow-sm">
            <Sun className="h-3.5 w-3.5 text-amber-400" />
            {isDaytime ? "Day" : "Night"}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[150px]"
          >
            <RadialBarChart
              innerRadius={65}
              outerRadius={85}
              data={chartData}
              startAngle={180}
              endAngle={0}
            >
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 8}
                            className="fill-foreground text-lg font-bold"
                          >
                            {daylight}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 8}
                            className="fill-muted-foreground text-xs"
                          >
                            Daylight
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
              <RadialBar
                dataKey="value"
                data={[chartData[0]]}
                fill={chartConfig.daylight.color}
                background={{ fill: chartConfig.night.color }}
                cornerRadius={10}
              />
            </RadialBarChart>
          </ChartContainer>

          <Separator className="my-3" />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Sunrise className="h-4 w-4 text-amber-500" />
              <div>
                <div className="text-sm font-medium">Sunrise</div>
                <div className="text-lg font-semibold">
                  {new Date(sunrise).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sunset className="h-4 w-4 text-amber-500" />
              <div>
                <div className="text-sm font-medium">Sunset</div>
                <div className="text-lg font-semibold">
                  {new Date(sunset).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
