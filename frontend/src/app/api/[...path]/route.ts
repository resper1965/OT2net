import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://ot2net-backend-21597837536.us-central1.run.app";

async function proxy(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = (await params).path.join("/");
  const url = `${BACKEND_URL}/api/${path}${request.nextUrl.search}`;
  
  console.log(`[Proxy] Forwarding ${request.method} request to: ${url}`);

  try {
    const headers = new Headers(request.headers);
    headers.delete("host"); // Avoid host mismatch errors

    const body =
      request.method !== "GET" && request.method !== "HEAD"
        ? await request.blob()
        : undefined;

    const response = await fetch(url, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });

    if (!response.ok) {
        console.error(`[Proxy] Backend returned error: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.error(`[Proxy] Error details: ${errorText}`);
        return new NextResponse(errorText, {
            status: response.status,
            headers: response.headers,
        });
    }

    const data = await response.arrayBuffer();
    return new NextResponse(data, {
      status: response.status,
      headers: response.headers,
    });

  } catch (error: any) {
    console.error("[Proxy] Critical Error connecting to backend:", error);
    return NextResponse.json(
      { error: "Backend Connection Error", details: error.message },
      { status: 500 }
    );
  }
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as DELETE, proxy as PATCH, proxy as HEAD };
