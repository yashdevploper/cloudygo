import connectUser from "@/utils/mongoDbConfig/connectUser";
import { NextResponse } from "next/server";

connectUser();

export async function GET() {
  try {
    const response = NextResponse.json({
      message: "Logout successful",
      success: true,
    });

    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return response;
  } catch (error: unknown) {
    const typedError = error as Error;
    return NextResponse.json(
      { error: typedError.message || "Logout failed" },
      { status: 500 }
    );
  }
}
