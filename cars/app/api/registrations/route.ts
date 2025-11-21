import { db } from '@/lib/db';

export async function GET() {
  return Response.json(db.getRegistrations());
}

export async function POST(request: Request) {
  const body = await request.json();
  const registration = db.addRegistration(body);
  return Response.json(registration, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, status } = body;
  const registration = db.updateRegistration(id, status);
  if (!registration) {
    return Response.json({ error: 'Registration not found' }, { status: 404 });
  }
  return Response.json(registration);
}
