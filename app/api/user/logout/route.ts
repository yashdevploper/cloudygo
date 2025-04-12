import connectUser from "@/utils/mongoDbConfig/connectUser";
import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server'

connectUser();

export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.json({
        message: "Logout Successfully",
        success: true
    })

    response.cookies.set("token", "", {
        httpOnly: true,
        expires: new Date(0)
    })

    return response

  } catch (err:any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
