import { aj } from "@/config/Arcjet";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req) {
  const user = await currentUser();

  if (!user?.primaryEmailAddress?.emailAddress) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const decision = await aj.protect(req, {
    userId: user.primaryEmailAddress.emailAddress,
    requested: 5, // must be > 0
  });

  const remainingToken = decision.reason.remaining;

  return NextResponse.json({ remainingToken });
}
