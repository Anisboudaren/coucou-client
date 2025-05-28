/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

if (!backendUrl) {
  throw new Error('Backend base URL is not defined in env');
}

async function proxyRequest(req: NextRequest) {
  // Get the path after /api/proxy
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api\/proxy/, '');
  console.log('path is : ', path);
  // Extract method and body
  const method = req.method || 'GET';
  let body: any;

  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    try {
      body = await req.json();
    } catch {
      body = undefined;
    }
  }

  // Clone headers but remove host
  const headers = new Headers(req.headers);
  headers.delete('host');

  try {
    const response = await axios({
      method,
      url: `${backendUrl}${path}`,
      data: body,
      headers: Object.fromEntries(headers.entries()),
      withCredentials: true,
      validateStatus: () => true, // Accept all statuses to forward them
    });

    return new NextResponse(JSON.stringify(response.data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        message: error.message || 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}

// Export named handlers for each HTTP method you want to support
export async function POST(req: NextRequest) {
  return proxyRequest(req);
}

export async function GET(req: NextRequest) {
  return proxyRequest(req);
}

// Add PUT, DELETE, PATCH similarly if needed
