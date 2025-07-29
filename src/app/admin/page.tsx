'use client';
import React from 'react';
import NavbarComponent from '@/components/principal/NavbarComponent';
import FooterComponent from '@/components/principal/FooterComponent';
import MainAdmin from '@/page-sections/admin/Main';

const AdminPage = () => {
  return (
    <>
      <NavbarComponent />
      <MainAdmin/>
      <FooterComponent />
    </>
  );
};

export default AdminPage;