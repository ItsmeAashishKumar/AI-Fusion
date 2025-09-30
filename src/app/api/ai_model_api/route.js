import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { model, msg, parentModel } = await req.json();

    const response = await axios.post(
      "https://kravixstudio.com/api/v1/chat",
      {
        message: msg,
        aiModel: model,
        outputType: "text",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.KRAVIX_STUDIO_API_KEY,
        },
      }
    );

    return NextResponse.json({
      ...response.data,
      model: parentModel,
    });
  } catch (err) {
    console.error("Backend error:", err.response?.data || err.message);

    return NextResponse.json(
      {
        error: "Something went wrong",
        details: err.response?.data || err.message,
      },
      { status: 500 }
    );
  }
}
