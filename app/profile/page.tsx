"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import NavBar from "@/components/appComponents/NavBar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogOut, User, MapPin, History, Heart, Settings } from "lucide-react";
import { useTheme } from "@/context/themeProvider";
import Link from "next/link";

interface UserProfile {
  _id?: string;
  name?: string;
  email?: string;
  createdAt?: string;
  userHistory?: Array<{
    city: string;
    timestamp: string;
    temperature: number;
  }>;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  // Fetch user details on page load
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("/api/user/profile");
        setUser(res.data.data);
      } catch (error: unknown) {
        toast.error("Failed to load profile. Please login again.");
        console.error("Profile fetch error:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await axios.get("/api/user/logout");
      if (!response || response.status !== 200) {
        throw new Error("Logout failed");
      }

      toast.success("Logged out successfully!");
      router.push("/login");
    } catch (error: unknown) {
      const typedError = error as Error;
      toast.error(typedError?.message || "Something went wrong");
      console.error("Logout error:", typedError);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "Dark" ? "radialBg" : "bg-light-gradient"
      }`}
    >
      <NavBar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>

        {isLoading ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <div className="h-64 bg-card/60 rounded-lg shadow animate-pulse"></div>
            <div className="md:col-span-2 h-64 bg-card/60 rounded-lg shadow animate-pulse"></div>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {/* Profile Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Account Info</CardTitle>
                <CardDescription>Your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-primary" />
                </div>

                <div className="text-center">
                  <h2 className="text-xl font-bold">{user?.name || "User"}</h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between py-2 border-b border-border/40">
                    <span className="text-sm text-muted-foreground">
                      Member since
                    </span>
                    <span className="text-sm">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/40">
                    <span className="text-sm text-muted-foreground">
                      User ID
                    </span>
                    <span className="text-sm text-xs opacity-60">
                      {user?._id ? user._id.substring(0, 8) + "..." : "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="destructive"
                  className="w-full cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </CardFooter>
            </Card>

            {/* Activity Section */}
            <div className="md:col-span-2 space-y-6">
              {/* Weather History */}
              <Card>
                <CardHeader className="pb-2">
                  <Link href={"/history"}>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Weather History</CardTitle>
                        <CardDescription>
                          Recent locations you&apos;ve checked
                        </CardDescription>
                      </div>
                      <History className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </Link>
                </CardHeader>
                <CardContent>
                  {user?.userHistory && user.userHistory.length > 0 ? (
                    <div className="space-y-3">
                      {user.userHistory.slice(0, 5).map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-card/60 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{item.city}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                              {new Date(item.timestamp).toLocaleDateString()} at{" "}
                              {new Date(item.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <span className="font-medium">
                              {item.temperature}°C
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No search history yet. Start by searching for a city!
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <Link href={"/favorites"}>
                <Card className="bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors">
                  <CardContent className="flex flex-col items-center justify-center py-6">
                    <Heart className="h-8 w-8 text-pink-500 mb-2" />
                    <h3 className="font-medium">Favorites</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage your favorite cities
                    </p>
                  </CardContent>
                </Card>
                </Link>

                <Card className="bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors">
                  <CardContent className="flex flex-col items-center justify-center py-6">
                    <Settings className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-medium">Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Customize your preferences
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
