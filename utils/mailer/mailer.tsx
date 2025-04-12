import nodemailer from "nodemailer";
import { encrypt } from "./encrypt-decrypt";
import { uuid } from "uuidv4";
import UserModel from "@/model/UserModel";

const generateEmailTemplate = (emailType: string, token?: string) => {
  let title, message, buttonText, href;

  switch (emailType) {
    case "VERIFY":
      title = "Verify Your Email";
      message =
        "Thank you for signing up! Please verify your email to continue.";
      buttonText = "Verify Email";
      href = `${process.env.DOMAIN}/verifyEmail?token=${token}`;
      break;
    case "FORGET":
      title = "Password Reset Request";
      message =
        "You requested a password reset. Click the button below to proceed.";
      buttonText = "Reset Password";
      href = `${process.env.DOMAIN}/resetPassword?token=${token}`;
      break;
    case "WELCOME":
      title = "Welcome to Our Platform! 🎉";
      message =
        "Congratulations on successfully signing up! We're excited to have you on board.";
      buttonText = "Get Started";
      href = `${process.env.DOMAIN}`;
      break;
    default:
      throw new Error("Invalid email type");
  }

  return `
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center;">
        <h2 style="color: #2F4F4F; margin-bottom: 25px;">${title}</h2>
        <p style="color: #4397E6; line-height: 1.6; margin-bottom: 25px; cursor: pointer;">${message}</p>
        ${
          buttonText &&
          `
          <a href="${href}" 
            style="display: inline-block; padding: 12px 30px; background-color: #4CAF50; 
            color: #fff; text-decoration: none; border-radius: 5px; font-weight: 500;
            transition: background-color 0.3s ease;">
            ${buttonText}
          </a>
        `
        }
        <p style="margin-top: 30px; color: #777; font-size: 12px;">
          Need help? Contact our support team at <a href="mailto:support@example.com" style="color: #4CAF50; text-decoration: none;">support@example.com</a>
        </p>
      </div>
    `;
};

interface SendEmailParams {
  userId: string;
  email: string;
  emailType: "VERIFY" | "FORGET" | "WELCOME";
}

export async function sendEmail({ userId, email, emailType }: SendEmailParams) {
  try {
    let encryptedVerifyToken, encryptedForgotToken;

    if (emailType === "VERIFY") {
      const verifyToken = uuid();
      encryptedVerifyToken = encrypt(verifyToken);

      await UserModel.findByIdAndUpdate(userId, {
        verifyToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "FORGET") {
      const forgotToken = uuid();
      encryptedForgotToken = encrypt(forgotToken);

      await UserModel.findByIdAndUpdate(userId, {
        forgotToken,
        forgotTokenExpiry: Date.now() + 3600000,
      });
    }

    const emailHTML = generateEmailTemplate(
      emailType,
      emailType === "VERIFY"
        ? encryptedVerifyToken
        : emailType === "FORGET"
        ? encryptedForgotToken
        : undefined
    );

    const user = process.env.MAILTRAP_USER;
    const pass = process.env.MAILTRAP_PASS;

    let transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user,
        pass,
      },
    });

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

    const mailOptions = {
      from: '"Your App Name" <welcome@example.com>',
      to: email,
      subject: getSubject(),
      html: emailHTML,
    };

    const sendEmail = await transport.sendMail(mailOptions);
    return sendEmail;
  } catch (err) {
    console.log("Error Occurred while sending mail: ", err);
  }
}

export default sendEmail;
