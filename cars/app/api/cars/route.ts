import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const brand = searchParams.get('brand');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const minYear = searchParams.get('minYear');
  const maxYear = searchParams.get('maxYear');
  const fuelType = searchParams.get('fuelType');
  const transmission = searchParams.get('transmission');

  let cars = db.getCars();

  if (search) {
    cars = db.searchCars(search);
  } else {
    const filters: any = {};
    if (brand) filters.brand = brand;
    if (minPrice) filters.minPrice = parseInt(minPrice);
    if (maxPrice) filters.maxPrice = parseInt(maxPrice);
    if (minYear) filters.minYear = parseInt(minYear);
    if (maxYear) filters.maxYear = parseInt(maxYear);
    if (fuelType) filters.fuelType = fuelType;
    if (transmission) filters.transmission = transmission;
    
    if (Object.keys(filters).length > 0) {
      cars = db.filterCars(filters);
    }
  }

  return Response.json(cars.filter(car => car.status === 'active'));
}

export async function POST(request: Request) {
  const body = await request.json();
  const car = db.addCar(body);
  return Response.json(car, { status: 201 });
}
