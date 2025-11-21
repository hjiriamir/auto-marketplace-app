import { db } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = db.getCarById(id);
  if (!car) {
    return Response.json({ error: 'Car not found' }, { status: 404 });
  }
  return Response.json(car);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const car = db.updateCar(id, body);
  if (!car) {
    return Response.json({ error: 'Car not found' }, { status: 404 });
  }
  return Response.json(car);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  db.deleteCar(id);
  return Response.json({ success: true });
}
