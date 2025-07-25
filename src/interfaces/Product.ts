export interface IProduct {
  _id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  stockPorTalla: {
    talla: number;
    stock: number;
  }[];
  material: {
    _id: string;
    name: string;
  };
  category: {
    _id: string;
    name: string;
  };
  subCategory: {
    _id: string;
    name: string;
  };
  groupCategory: {
    _id: string;
    name: string;
  };
  brand: {
    _id: string;
    name: string;
  };
  descuento?: number;
  resenias?: Resenia[];
  caracteristicas: {
    nombre: string;
    valor: string;
  }[];
  isNewProduct: boolean;
  isTrending: boolean;
  season?: string;
  createdAt?: string;
}

export interface Resenia {
  cliente: string;
  valoracion: number;
  comentario: string;
}
