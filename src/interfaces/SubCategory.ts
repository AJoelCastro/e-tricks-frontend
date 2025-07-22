import { IProductCategory } from './ProductCategory';


export interface ISubCategory {
  _id: string;
  name: string;
  image: string;
  active?: boolean;
  productcategories?: IProductCategory[];
  createdAt?: string;
}
