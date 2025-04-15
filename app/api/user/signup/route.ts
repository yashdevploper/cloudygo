import connectUser from "@/utils/mongoDbConfig/connectUser";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import UserModel from "@/model/UserModel";
import bcrypt from "bcryptjs";
import axios from "axios";

connectUser();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    if (Object.values(reqBody).some((value) => !value)) {
      return NextResponse.json(
        { message: "Please provide all the required fields." },
        { status: 400 }
      );
    }

    const { username, email, password } = reqBody;

    const UserExist = await UserModel.findOne({ email });
    if (UserExist) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password.toString(), salt);

    const newUser = await new UserModel({
      username,
      email,
      password: hashedPassword,
    });

    // save user
    const savedUser = await newUser.save();

    // send verification email
    const userId = savedUser._id;
    const emailType = "VERIFY";
    await axios.post("/api/user/sendEmail", {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        userId,
        email,
        emailType,
      },
    });
    console.log("email route hit");

    const response = NextResponse.json(
      {
        message: "User registered successfully",
        success: true,
        user: {
          id: savedUser._id,
          username: savedUser.username,
          email: savedUser.email,
          isVerified: savedUser.isVerified,
        },
      },
      { status: 200 }
    );

    return response;
  } catch (err) {
    NextResponse.json(
      { message: "Error occurred during signup: ", err },
      { status: 400 }
    );
  }
}
