"use server";

// import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  //   const session = await auth.api.getSession({
  //     headers: await headers(),
  //   });
  //   if (!session) return NextResponse.json("Please sign in");

  const formData = await req.formData();
  const file = formData.get("file");
  if (file) {
    const response = await fetch("http://localhost:8000/uploadcsv", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    console.log(result);

    return NextResponse.json(result);
  }
}
