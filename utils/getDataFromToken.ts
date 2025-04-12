import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = async (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || "";
    const envToken = process.env.TOKEN_SECRET;

    if (!token) {
      throw new Error("No token found");
    }

    if (!envToken) {
      throw new Error("Token secret is not configured");
    }

    const decodeToken: any = jwt.verify(token, envToken);
    return decodeToken.id;
  } catch (err: any) {
    throw new Error(
      err?.message || "Something went wrong while decoding the token"
    );
  }
};
