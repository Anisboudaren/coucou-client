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
  headers.delete('host'); // Avoid passing "host" to backend
  headers.delete('accept-encoding'); // 🔥 Fix broken GET requests on Vercel

  const body =
    req.method !== 'GET' && req.method !== 'HEAD' ? await req.clone().arrayBuffer() : undefined;

  const res = await fetch(`${API_URL}${targetPath}`, {
    method: req.method,
    headers,
    body,
    credentials: 'include',
  });

  const responseBody = await res.arrayBuffer();
  const responseHeaders = new Headers(res.headers);
  responseHeaders.delete('content-encoding'); // Avoid double compression errors

  return new Response(responseBody, {
    status: res.status,
    statusText: res.statusText,
    headers: responseHeaders,
  });
}
