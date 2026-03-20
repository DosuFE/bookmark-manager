import { NextResponse } from 'next/server';

const API_BASE = process.env.API_URL || 'http://localhost:5000';
const BOOKMARK_PATH = '/bookmark';

async function forwardRequest(
  method: string,
  url: string,
  body?: any
) {
  try {
    console.log(`[API] ${method} ${url}`);
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    });

    console.log(`[API] Response status: ${res.status}`);
    const data = await res.json().catch(() => null);
    console.log(`[API] Response data:`, data);

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('API ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend' },
      { status: 500 }
    );
  }
}

// GET ALL
export async function GET() {
  const url = `${API_BASE}${BOOKMARK_PATH}`;
  return forwardRequest('GET', url);
}

// POST
export async function POST(request: Request) {
  const body = await request.json();
  const url = `${API_BASE}${BOOKMARK_PATH}`;
  return forwardRequest('POST', url, body);
}

// PATCH
export async function PATCH(request: Request) {
  const body = await request.json();
  const id = body?.id;

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const url = `${API_BASE}${BOOKMARK_PATH}/${id}`;
  return forwardRequest('PATCH', url, body);
}

// DELETE
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const url = `${API_BASE}${BOOKMARK_PATH}/${id}`;
  return forwardRequest('DELETE', url);
}