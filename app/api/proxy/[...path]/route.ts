// app/api/proxy/[...path]/route.ts
import { NextRequest } from 'next/server';

export const runtime = 'nodejs'; // Required for streaming and fetch

const API_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:5000';

export async function GET(req: NextRequest) {
  return proxy(req);
}
export async function POST(req: NextRequest) {
  return proxy(req);
}
export async function PUT(req: NextRequest) {
  return proxy(req);
}
export async function DELETE(req: NextRequest) {
  return proxy(req);
}

async function proxy(req: NextRequest) {
  const url = new URL(req.url);
  // Remove `/api/proxy` prefix from path to forward correctly
  const targetPath = url.pathname.replace(/^\/api\/proxy/, '') + url.search;

  // Clone headers but remove problematic ones
  const headers = new Headers(req.headers);

  // Remove headers that may cause caching or compression issues
  headers.delete('host');
  headers.delete('accept-encoding');
  headers.delete('if-none-match');
  headers.delete('if-modified-since');

  // Only send body for applicable methods
  const body = req.method !== 'GET' && req.method !== 'HEAD' ? await req.arrayBuffer() : undefined;

  // Forward request to backend API
  const backendResponse = await fetch(`${API_URL}${targetPath}`, {
    method: req.method,
    headers,
    body,
    credentials: 'include', // Forward cookies
  });

  // Clone response headers and remove content encoding to avoid double compression
  const responseHeaders = new Headers(backendResponse.headers);
  responseHeaders.delete('content-encoding');
  responseHeaders.delete('content-length');

  // Stream response body directly
  return new Response(backendResponse.body, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
    headers: responseHeaders,
  });
}
