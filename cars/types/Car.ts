export interface Car {
    id: string;
    brand: string;
    model: string;
    price: number;
    year: number;
    mileage: number;
    fuelType: string;
    description: string;
    status: "active" | "pending" | "sold";
    images: string[];
    seller: {
      name: string;
      phone: string;
    };
  }
  