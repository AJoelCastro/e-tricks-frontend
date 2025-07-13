export interface IProduct {
  _id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  size: string[];
  stock: number;
  category: string;
  descuento?: number;
  marca: string;
  resenias?: Resenia[];
}
interface Resenia {
  cliente: string;
  valoracion: number;
  comentario: string;
}
