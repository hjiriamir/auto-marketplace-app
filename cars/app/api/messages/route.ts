import { db } from '@/lib/db';

export async function GET() {
  return Response.json(db.getMessages());
}

export async function POST(request: Request) {
  const body = await request.json();
  const message = db.addMessage(body);
  return Response.json(message, { status: 201 });
}
