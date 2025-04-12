"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import { useCity } from "@/context/searchCityContext";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// This could be a placeholder/fallback data
const defaultChartData = [
  { month: "January", temperature: 5, humidity: 80 },
  { month: "February", temperature: 8, humidity: 75 },
  { month: "March", temperature: 12, humidity: 65 },
  { month: "April", temperature: 16, humidity: 60 },
  { month: "May", temperature: 20, humidity: 55 },
  { month: "June", temperature: 24, humidity: 50 },
];

// Updated chart config
const chartConfig = {
  temperature: {
    label: "Temperature (°C)",
    color: "hsl(var(--chart-1))",
  },
  humidity: {
    label: "Humidity (%)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function LineDoteChart() {
  const { weatherData, isLoading } = useCity();
  const [chartData, setChartData] = useState(defaultChartData);
  const [trend, setTrend] = useState({ value: 0, direction: "up" });

  // Generate simulated weather forecast data based on current weather
  useEffect(() => {
    if (weatherData && !isLoading) {
      const temperature = weatherData.temperature;
      const humidity = weatherData.humidity;

      // Generate some simulated forecast data based on current weather
      const simulatedForecast = generateForecastData(temperature, humidity);
      setChartData(simulatedForecast);

      // Calculate trend
      const lastValue =
        simulatedForecast[simulatedForecast.length - 1].temperature;
      const firstValue = simulatedForecast[0].temperature;
      const trendValue = Math.round(
        ((lastValue - firstValue) / firstValue) * 100
      );
      setTrend({
        value: Math.abs(trendValue),
        direction: trendValue >= 0 ? "up" : "down",
      });
    }
  }, [weatherData, isLoading]);

  // Function to generate simulated forecast data
  const generateForecastData = (
    currentTemp: number,
    currentHumidity: number
  ) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const today = new Date();
    const dayIndex = today.getDay();

    return Array.from({ length: 6 }, (_, i) => {
      // Get day name for next 6 days
      const dayName = daysOfWeek[(dayIndex + i) % 7];

      // Generate temperature with some random variation
      const tempVariation = Math.floor(Math.random() * 7) - 3; // -3 to +3
      const nextTemp = Math.max(0, currentTemp + i * 0.5 + tempVariation);

      // Generate humidity with some random variation
      const humidityVariation = Math.floor(Math.random() * 11) - 5; // -5 to +5
      const nextHumidity = Math.min(
        100,
        Math.max(30, currentHumidity + humidityVariation - i * 2)
      );

      return {
        month: dayName,
        temperature: Math.round(nextTemp),
        humidity: Math.round(nextHumidity),
      };
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Weather Forecast</CardTitle>
        <CardDescription>
          {weatherData
            ? `${weatherData.city}, ${weatherData.country}`
            : "Weather forecast"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="temperature"
              type="natural"
              stroke={chartConfig.temperature.color}
              strokeWidth={2}
              dot={{
                fill: chartConfig.temperature.color,
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
            <Line
              dataKey="humidity"
              type="natural"
              stroke={chartConfig.humidity.color}
              strokeWidth={2}
              dot={{
                fill: chartConfig.humidity.color,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {trend.direction === "up" ? "Trending up" : "Trending down"} by{" "}
          {trend.value}% this week
          <TrendingUp
            className={`h-4 w-4 ${
              trend.direction === "down" ? "rotate-180" : ""
            }`}
          />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing temperature and humidity forecast for the next 6 days
        </div>
      </CardFooter>
    </Card>
  );
}
