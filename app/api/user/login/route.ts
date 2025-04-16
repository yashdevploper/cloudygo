import UserModel from "@/model/UserModel";
import connectUser from "@/utils/mongoDbConfig/connectUser";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
connectUser();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    console.log(reqBody);
    const { email, password } = await reqBody;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Email not found try to signup" },
        { status: 404 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { message: "The Email is not verified" },
        { status: 403 }
      );
    }

    const validatePassword = await bcrypt.compare(password, user.password);
    console.log(validatePassword);

    if (!validatePassword) {
      return NextResponse.json(
        { message: "Incorrect password, please try again" },
        { status: 401 }
      );
    }

    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const tokenSecret = process.env.TOKEN_SECRET;

    if (!tokenSecret) {
      throw new Error("TOKEN_SECRET is not defined in environment variables.");
    }

    // creating cookies
    const jsonToken = jwt.sign(tokenData, tokenSecret, { expiresIn: "5d" });

    const response = NextResponse.json({
      message: "Logged in successfully",
      success: true,
    });

    response.cookies.set("token", jsonToken, {
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    console.log("Cookie set");
    
        // await axios.post("/api/user/sendEmail", {
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: {
        //     userId: user._id,
        //     email: user.email,
        //     emailType: "WELCOME",
        //   },
        // });

    return response;
  } catch (error: unknown) {
    // Convert to more specific type
    const typedError = error as Error;
    return NextResponse.json(
      { error: typedError.message || "Login failed" },
      { status: 500 }
    );
  }
}
