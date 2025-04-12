import connectUser from "@/utils/mongoDbConfig/connectUser";
import UserModel from "@/model/UserModel";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getDataFromToken } from "@/utils/getDataFromToken";

connectUser();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const user = await UserModel.findOne({ _id: userId }).select("-password");

    if (!user) {
      return NextResponse.json({
        message: "Can't find user",
      });
    }

    return NextResponse.json({
      message: "User found!",
      data: user,
    });
  } catch (error: unknown) {
    const typedError = error as Error;
    return NextResponse.json(
      { error: typedError.message || "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
