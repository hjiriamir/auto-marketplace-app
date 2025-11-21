'use client';

import { Car } from '@/lib/db';
import { X } from 'lucide-react';

interface CarComparisonProps {
  cars: Car[];
  onRemove: (id: string) => void;
}

export function CarComparison({ cars, onRemove }: CarComparisonProps) {
  if (cars.length === 0) return null;

  const specs = [
    { label: 'Marque', key: 'brand' },
    { label: 'Modèle', key: 'model' },
    { label: 'Année', key: 'year' },
    { label: 'Prix', key: 'price', format: (v: any) => `${v.toLocaleString()} DT` },
    { label: 'Kilométrage', key: 'mileage', format: (v: any) => `${v.toLocaleString()} km` },
    { label: 'Carburant', key: 'fuelType' },
    { label: 'Transmission', key: 'transmission' },
    { label: 'État', key: 'condition' },
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Comparaison</h2>
      <table className="w-full">
        <tbody>
          {specs.map((spec) => (
            <tr key={spec.key} className="border-b border-border">
              <td className="py-3 px-4 font-semibold text-foreground bg-background">{spec.label}</td>
              {cars.map((car) => (
                <td key={car.id} className="py-3 px-4 text-foreground">
                  {spec.format ? spec.format((car as any)[spec.key]) : (car as any)[spec.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
