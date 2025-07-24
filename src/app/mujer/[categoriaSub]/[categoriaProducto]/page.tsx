'use client';
import FooterComponent from '@/components/FooterComponent'
import NavbarComponent from '@/components/NavbarComponent'
import { SplashScreen } from '@/components/splash-screen';
import ProductCategoryPageSection from '@/page-sections/category/ProductCategoryPageSection'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import React, { useEffect, useState } from 'react'
import GroupCategoryService from '@/services/GroupCategoryService';
import { IGroupCategory } from '@/interfaces/GroupCategory';
import { ISubCategory } from '@/interfaces/SubCategory';
import { usePathname } from 'next/navigation';
import { setCategoryId, setSubcategoryId, setProductCategoryId } from '@/store/slices/categorySelectionSlice';
import { IProductCategory } from '@/interfaces/ProductCategory';
const ProductCategoryPage = () => {
  const [idGroup, setIdGroup] = useState<string>('');
  const [idSub, setIdSub] = useState<string>('');
  const [idProduct, setIdProduct] = useState<string>('');
  const pathname = usePathname()
    const dispatch = useDispatch();
    useEffect(() => {
      const segments = pathname.split('/').filter(Boolean);
      const categoria = segments[0];
      const subcategoria = segments[1];
      const productCategoria = segments[2];
      const getIdsSubCaterory = async () => {
        try{
          const data = await GroupCategoryService.getGroupCategories();
          const category = data.find((group:IGroupCategory) => group.routeLink === categoria)?._id;
          dispatch(setCategoryId(category!));
          setIdGroup(category!);
          const subcategoryId = data.find((group:IGroupCategory) => group.routeLink === categoria)?.subcategories.find((sub:ISubCategory) => sub.routeLink === subcategoria)?._id;
          dispatch(setSubcategoryId(subcategoryId!));
          setIdSub(subcategoryId!);
          const productcategoryId = data.find((group:IGroupCategory) => group.routeLink === categoria)?.subcategories.find((sub:ISubCategory) => sub.routeLink === subcategoria)?.productcategories.find((prod:IProductCategory)=>prod.routeLink === productCategoria)?._id;
          dispatch(setProductCategoryId(productcategoryId!));
          setIdProduct(productcategoryId!);
        }catch(error){
          throw error
        }
      }
      getIdsSubCaterory();
    }, [])
    if (!idGroup || !idSub || !idProduct) return <SplashScreen/>;
  return (
    <>
      <NavbarComponent/>
      <ProductCategoryPageSection idGroup={idGroup!} idSub={idSub!} idProduct={idProduct!}/>
      <FooterComponent/>
    </>
  )
}

export default ProductCategoryPage
