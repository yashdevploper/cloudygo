import connectUser from "@/utils/mongoDbConfig/connectUser";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import UserModel from "@/model/UserModel";
import { encrypt } from "@/utils/mailer/encrypt-decrypt";
import { v4 as uuidv4 } from "uuid";
import { Resend } from "resend";
import generateEmailTemplate from "@/utils/mailer/mailTemplate";

connectUser();

interface SendEmailParams {
  userId: string;
  email: string;
  emailType: "VERIFY" | "FORGET" | "WELCOME";
}

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { userId, email, emailType }: SendEmailParams = reqBody;

    console.log(userId);
    console.log(email);
    console.log(emailType);
    
    if (!userId || !email || !emailType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("passed the field checking");
    console.log(reqBody);

    let encryptedVerifyToken, encryptedForgotToken, token;

    if (emailType === "VERIFY") {
      const verifyToken = uuidv4();
      encryptedVerifyToken = encrypt(verifyToken);
      token = encryptedVerifyToken;

      await UserModel.findByIdAndUpdate(userId, {
        verifyToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "FORGET") {
      const forgotToken = uuidv4();
      encryptedForgotToken = encrypt(forgotToken);
      token = encryptedForgotToken;

      await UserModel.findByIdAndUpdate(userId, {
        forgotToken,
        forgotTokenExpiry: Date.now() + 3600000,
      });
    }

    const emailHTML = generateEmailTemplate(emailType, token);

    const resend = new Resend(process.env.RESEND_API_KEY);

    const getSubject = () => {
      switch (emailType) {
        case "VERIFY":
          return "Verify Your Email";
        case "FORGET":
          return "Reset your password";
        case "WELCOME":
          return "Congratulations";
        default:
          return "Important Message";
      }
    };

    const sendEmail = await resend.emails.send({
      from: "CloudyGo <no-reply@cloudygo.dev>",
      to: email,
      subject: getSubject(),
      html: emailHTML,
    });

    console.log("email sended");

    return NextResponse.json(
      { success: true, data: sendEmail },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.log("Error Occurred while sending mail: ", error);
  }
}
