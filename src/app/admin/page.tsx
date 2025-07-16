'use client';
import React from 'react';
import NavbarComponent from '@/components/NavbarComponent';
import FooterComponent from '@/components/FooterComponent';
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