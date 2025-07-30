'use client';
import { SplashScreen } from '@/components/splash-screen';
import GroupCategoryService from '@/services/GroupCategoryService';
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { setMarcaId } from '@/store/slices/marcaSelectionSlice';
import BrandService from '@/services/BrandService';
import { IBrandWithCategories } from '@/interfaces/Brand';
import SubCategoryPageSection from '@/page-sections/categories/category/SubCategoryPageSection';

const MarcaPage = () => {
  const [idMarca, setIdMarca] = useState<string>('');
  const pathname = usePathname()
  const dispatch = useDispatch();
  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean);
    const categoria = segments[0];
    console.log('categoria', categoria)
    const marcaNombre = segments[1];
    console.log('subcategoria', marcaNombre)
    const getIdsSubCaterory = async () => {
      try{
        const data = await BrandService.getBrandsWithProductCategories();
        console.log('data', data)
        const marca = data.find(
          (marca: IBrandWithCategories) => marca.brand.name.toLowerCase() === marcaNombre.toLowerCase()
        );
        const category = marca?.brand._id;
        console.log('category', category)
        dispatch(setMarcaId(category!));
        setIdMarca(category!);
      }catch(error){
        throw error
      }
    }
    getIdsSubCaterory();
  }, [])
  if (!idMarca) return <SplashScreen/>;
  
  return (
    <>
      <SubCategoryPageSection marca marcaId={idMarca}/>
    </>
  )
}

export default MarcaPage
