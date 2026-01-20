import { ISubCategory } from './SubCategory';
import { IBrand } from './Brand';

export interface IGroupCategory {
  _id: string;
  name: string;
  description: string;
  image: string;
  active?: boolean;
  subcategories?: ISubCategory[];
  brands?:IBrand[];
  routeLink?: string;
  createdAt?: string;
}
