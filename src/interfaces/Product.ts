export interface IProduct {
  _id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  stockPorTalla: { talla: number; stock: number }[];
  category: {
    _id: string;
    name: string;
  };
  material: {
    _id: string;
    name: string;
  };
  brand: {
    _id: string;
    name: string;
  };
  descuento?: number;
  resenias?: Resenia[];
  createdAt?: string;
}

interface Resenia {
  cliente: string;
  valoracion: number;
  comentario: string;
}
