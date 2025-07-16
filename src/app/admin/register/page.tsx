'use client';
import React from 'react';
import NavbarComponent from '@/components/NavbarComponent';
import FooterComponent from '@/components/FooterComponent';
import AdminProductsPanel from '@/page-sections/admin/register/ProductsPanel';

const AdminRegisterPage = () => {
  return (
    <>
      <NavbarComponent />
      <AdminProductsPanel />
      <FooterComponent />
    </>
  );
};

export default AdminRegisterPage;