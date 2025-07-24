'use client';
import FooterComponent from '@/components/FooterComponent'
import NavbarComponent from '@/components/NavbarComponent'
import { SplashScreen } from '@/components/splash-screen';
import SubCategoryPageSection from '@/page-sections/category/SubCategoryPageSection'
import GroupCategoryService from '@/services/GroupCategoryService';
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { setCategoryId, setSubcategoryId } from '@/store/slices/categorySelectionSlice';
import { IGroupCategory } from '@/interfaces/GroupCategory';
import { ISubCategory } from '@/interfaces/SubCategory';

const SubCategoryPage = () => {
  const [idGroup, setIdGroup] = useState<string>('');
  const [idSub, setIdSub] = useState<string>('');
  const pathname = usePathname()
  const dispatch = useDispatch();
  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean);
    const categoria = segments[0];
    const subcategoria = segments[1];
    const getIdsSubCaterory = async () => {
      try{
        const data = await GroupCategoryService.getGroupCategories();
        const category = data.find((group:IGroupCategory) => group.routeLink === categoria)?._id;
        dispatch(setCategoryId(category!));
        setIdGroup(category!);
        const subcategoryId = data.find((group:IGroupCategory) => group.routeLink === categoria)?.subcategories.find((sub:ISubCategory) => sub.routeLink === subcategoria)?._id;
        dispatch(setSubcategoryId(subcategoryId!));
        setIdSub(subcategoryId!);
      }catch(error){
        throw error
      }
    }
    getIdsSubCaterory();
  }, [])
  if (!idGroup || !idSub) return <SplashScreen/>;
  
  return (
    <>
      <NavbarComponent/>
      <SubCategoryPageSection groupId={idGroup!} subId={idSub!}/>
      <FooterComponent/>
    </>
  )
}

export default SubCategoryPage
