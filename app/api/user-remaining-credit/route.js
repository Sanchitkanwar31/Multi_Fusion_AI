import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { aj } from "@/config/Arcjet";

export async function POST(req) {
  try {
    const user = await currentUser();
    const userId = user?.primaryEmailAddress?.emailAddress;

    let token = 0;
    const bodyText = await req.text();
    if (bodyText) {
      const body = JSON.parse(bodyText);
      token = body.token || 0;
    }

    const decision = await aj.protect(req, { userId, requested: token });

    if (token && decision.isDenied()) {
      return NextResponse.json({
        error: "Too many requests",
        remainingtoken: decision.reason.remaining,
      });
    }

    return NextResponse.json({
      allowed: true,
      remainingtoken: decision.reason.remaining,
    });
  } catch (err) {
    console.log("Arcjet error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// import { currentUser } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import { aj } from "@/config/Arcjet";
// import axios from "axios";

// export async function POST(req) {
//   try {
//     const user = await currentUser();
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { token } = await req.json();
//     const userId = user?.primaryEmailAddress?.emailAddress;

//     if (token) {
//       const decision = await aj.protect(req, { userId, requested: token });

//       if (decision.isDenied()) {
//         return NextResponse.json({
//           error: "Too many requests",
//           remainingtoken: decision.reason.remaining,
//         });
//       }

//       return NextResponse.json({
//         allowed: true,
//         remainingtoken: decision.reason.remaining,
//       });
//     }

//     const decision = await aj.protect(req, { userId, requested: 0 });
//     console.log("Arcjet decision:", decision.reason.remaining);

//     return NextResponse.json({
//       remainingtoken: decision.reason.remaining,
//     });
//   } 
//   catch (error) {
//     console.error("Arcjet API Error:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
