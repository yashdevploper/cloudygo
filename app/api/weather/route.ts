import axios from "axios";
import { NextResponse, type NextRequest } from "next/server";
import connectUser from "@/utils/mongoDbConfig/connectUser";
import UserModel from "@/model/UserModel";
import { getDataFromToken } from "@/utils/getDataFromToken";

connectUser();

// Define custom error interface for better type safety
interface ApiError extends Error {
  response?: {
    status: number;
    data?: any;
  };
}

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    if (!reqBody) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    const { city } = reqBody;

    if (!city) {
      return NextResponse.json(
        { error: "City parameter is required" },
        { status: 400 }
      );
    }

    const openWeatherApiKey = process.env.OPENWEATHER_API_KEY;
    if (!openWeatherApiKey) {
      return NextResponse.json(
        { error: "OpenWeather API key is not configured" },
        { status: 500 }
      );
    }

    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: city,
          appid: openWeatherApiKey,
          units: "metric",
        },
      }
    );

    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const user = await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        $push: {
          userHistory: {
            city: data.name,
            coordinates: {
              type: "Point",
              coordinates: [data.coord.lon, data.coord.lat],
            },
            temperature: data.main.temp,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: unknown) {
    const typedError = error as ApiError;
    console.error("Weather API Error:", typedError);
    return NextResponse.json(
      { error: typedError.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const city = url.searchParams.get("city");

    if (!city) {
      return NextResponse.json(
        { error: "City parameter is required" },
        { status: 400 }
      );
    }

    const openWeatherApiKey = process.env.OPENWEATHER_API_KEY;
    if (!openWeatherApiKey) {
      return NextResponse.json(
        { error: "OpenWeather API key is not configured" },
        { status: 500 }
      );
    }

    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: city,
          appid: openWeatherApiKey,
          units: "metric",
        },
      }
    );

    try {
      const userId = await getDataFromToken(request);
      if (userId) {
        await UserModel.findOneAndUpdate(
          { _id: userId },
          {
            $push: {
              userHistory: {
                city: data.name,
                coordinates: {
                  type: "Point",
                  coordinates: [data.coord.lon, data.coord.lat],
                },
                temperature: data.main.temp,
                timestamp: new Date(),
              },
            },
          },
          { new: true }
        );
      }
    } catch (_) {
      // Ignore authentication errors - user can still get weather without being logged in
      console.log(
        "Non-authenticated weather request or user history update failed"
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: unknown) {
    const typedError = error as ApiError;
    console.error("Weather API Error:", typedError);
    return NextResponse.json(
      { error: typedError.message || "Internal server error" },
      { status: 500 }
    );
  }
}
