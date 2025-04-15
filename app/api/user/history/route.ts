import connectUser from "@/utils/mongoDbConfig/connectUser";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import UserModel from "@/model/UserModel";
import { getDataFromToken } from "@/utils/getDataFromToken";

connectUser();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({
        message: "Can't find userId",
      });
    }

    const user = await UserModel.findOne({ _id: userId }).select("-password");
    if (!user) {
      return NextResponse.json({
        message: "Can't find user",
      });
    }

    const reversedUserHistory = user.userHistory.slice().reverse()

    return NextResponse.json({message: "user found", history: reversedUserHistory})

  } catch (error) {
    const typedError = error as Error;
    return NextResponse.json(
      { error: typedError.message || "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
