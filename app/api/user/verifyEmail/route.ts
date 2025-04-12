import { decrypt } from "@/utils/mailer/encrypt-decrypt";
import connectUser from "@/utils/mongoDbConfig/connectUser";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import UserModel from "@/model/UserModel";

connectUser();

export async function POST(request: NextRequest) {
  console.log("Verification started");

  try {
    const reqBody = await request.json();
    const { token } = reqBody;
    const decryptVerifyToken: string = decrypt(token);
    console.log(decryptVerifyToken);

    const user = await UserModel.findOne({
      verifyToken: decryptVerifyToken,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid Token" }, { status: 500 });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    console.log("Email Verified");

    return NextResponse.json(
      { message: "User verified Successfully", success: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    const typedError = error as Error;
    return NextResponse.json(
      { error: typedError.message || "Email verification failed" },
      { status: 500 }
    );
  }
}
