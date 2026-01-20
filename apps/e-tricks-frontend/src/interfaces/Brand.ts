import { IProductCategory } from "./ProductCategory";

export interface IBrand {
  _id: string;
  name: string;
  image: string;
  createdAt?: string;
}

export interface IBrandWithCategories {
  _id: string;
  brand: IBrand;
  categories: IProductCategory[]; // ✅ ahora cada categoría es un objeto con _id y name
}