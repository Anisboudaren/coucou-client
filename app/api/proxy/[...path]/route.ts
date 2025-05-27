// app/api/proxy/[...path]/route.ts
import { NextRequest } from 'next/server';

export const runtime = 'nodejs'; // Use node runtime for proper stream handling

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
  const targetPath = url.pathname.replace(/^\/api\/proxy/, '');

  const headers = new Headers(req.headers);
  headers.delete('host');
  //   headers.delete('accept-encoding');

  const body =
    req.method !== 'GET' && req.method !== 'HEAD' ? await req.clone().arrayBuffer() : undefined;

  const res = await fetch(`${API_URL}${targetPath}`, {
    method: req.method,
    headers,
    body,
    credentials: 'include',
  });

  // Remove content-encoding header to prevent double decompression on client
  const responseHeaders = new Headers(res.headers);
  //   responseHeaders.delete('content-encoding');

  // Stream backend response directly to client without buffering whole response
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: responseHeaders,
  });
}
