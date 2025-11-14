import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://notehub-api.goit.study";

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(req, params);
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(req, params);
}

export async function PATCH(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(req, params);
}

export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(req, params);
}

async function proxyRequest(req: NextRequest, params: { path: string[] }) {
  const target = `${API_URL}/${params.path.join("/")}`;

  const body = req.body ? await req.text() : undefined;

  const res = await fetch(target, {
    method: req.method,
    headers: {
      "Content-Type": req.headers.get("content-type") || "application/json",
      Cookie: req.headers.get("cookie") || "",
    },
    body,
    credentials: "include",
  });

  const responseText = await res.text();

  return new NextResponse(responseText, {
    status: res.status,
    headers: res.headers,
  });
}
