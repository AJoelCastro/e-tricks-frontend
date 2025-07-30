'use client';
import { SplashScreen } from '@/components/splash-screen';
import ProductCategoryPageSection from '@/page-sections/categories/category/ProductCategoryPageSection'
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react'
import GroupCategoryService from '@/services/GroupCategoryService';
import { IGroupCategory } from '@/interfaces/GroupCategory';
import { ISubCategory } from '@/interfaces/SubCategory';
import { usePathname } from 'next/navigation';
import { setMarcaId, setProductCategoryId } from '@/store/slices/marcaSelectionSlice';
import { IProductCategory } from '@/interfaces/ProductCategory';
import BrandService from '@/services/BrandService';
import { IBrandWithCategories } from '@/interfaces/Brand';
const CategoryPage = () => {
  const [idMarca, setIdMarca] = useState<string>('');
  const [idProduct, setIdProduct] = useState<string>('');
  const pathname = usePathname()
    const dispatch = useDispatch();
    useEffect(() => {
      const segments = pathname.split('/').filter(Boolean);
      const categoria = segments[0];
      const marcaName = segments[1];
      const productCategoria = segments[2];
      const getIdsSubCaterory = async () => {
        try{
          console.log('marcaName', marcaName)
          console.log('productCategoria', productCategoria)
          const data = await BrandService.getBrandsWithProductCategories();
          const marca = data.find(
            (marca: IBrandWithCategories) => marca.brand.name.toLowerCase() === marcaName.toLowerCase()
          );
          const category = marca?.brand._id;
          dispatch(setMarcaId(category!));
          setIdMarca(category!);
          console.log('category', category)
          const productcategoryId = data.find((marca:IBrandWithCategories) => marca.brand.name.toLowerCase() === marcaName)?.categories.find((sub:IProductCategory) => sub.routeLink === productCategoria)?._id;
          dispatch(setProductCategoryId(productcategoryId!));
          setIdProduct(productcategoryId!);
          console.log('productcategoryId', productcategoryId)
        }catch(error){
          throw error
        }
      }
      getIdsSubCaterory();
    }, [])
    if (!idMarca || !idProduct) return <SplashScreen/>;
  return (
    <>
      <ProductCategoryPageSection marca marcaId={idMarca!} idProduct={idProduct!}/>
    </>
  )
}

export default CategoryPage
