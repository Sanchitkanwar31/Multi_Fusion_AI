import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
    
  /* Send POST request using Axios,so KRAAVIX STUDIO IS GIVING A PREBUILT API ENDPOINT WHERE WE CAN SEND MESSAGE TO THE AI MODEL ND GET RESPONSE*/

  const {model,msg,parentmodel} = await req.json();

  const response = await axios.post(
    "https://kravixstudio.com/api/v1/chat",
    {
      message: msg,
      aiModel: model,
      outputType: "text", 
    },
    {
      headers: {
        "Content-Type": "application/json", // Tell server we're sending JSON
        Authorization : `Bearer ${process.env.KRAVIX_API_KEY}`, // Use your actual API key of kravix that give the backend api
      },
    }
  );

   console.log("✅ Kravix Response:", response.data);
  //ensure to update the response
  return NextResponse.json({ ...response.data, model: parentmodel });      
}



// import axios from "axios";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const { model, msg, parentmodel } = await req.json();

//     console.log("🛰️ Incoming Request:", { model, parentmodel });

//     const response = await axios.post(
//       "https://kravixstudio.com/api/v1/chat",
//       {
//         message: msg, // ✅ send msg directly, not [msg]
//         aiModel: model,
//         outputType: "text",
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.KRAVIX_API_KEY}`, // ✅ template literal
//         },
//       }
//     );

//     console.log("✅ Kravix Response:", response.data);

//     // ✅ Fix: return the actual AI text in aiResponse
//     const aiResponse =
//       response.data.response ||
//       response.data.output ||
//       "⚠️ No valid response from Kravix.";

//     return NextResponse.json({
//       aiResponse,
//       model: parentmodel,
//     });
//   } catch (error) {
//     console.error("❌ Kravix API Error:", error.response?.data || error.message);

//     return NextResponse.json(
//       {
//         aiResponse: "⚠️ Error at backend connect.",
//         model: "error",
//       },
//       { status: error.response?.status || 500 }
//     );
//   }
// }
