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

// Add more HTTP methods if needed...

async function proxy(req: NextRequest) {
  const url = new URL(req.url);
  const targetPath = url.pathname.replace(/^\/api\/proxy/, '');

  const res = await fetch(`${API_URL}${targetPath}`, {
    method: req.method,
    headers: req.headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    credentials: 'include',
  });

  const body = await res.arrayBuffer();
  const headers = new Headers(res.headers);
  return new Response(body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}
