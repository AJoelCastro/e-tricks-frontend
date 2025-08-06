import React from 'react';
import MainAdminPageSection from '@/page-sections/admin/Main';
import { Metadata } from 'next';

export const metadata: Metadata ={
  title: 'Admin | Tricks',
}
const AdminPage = () => {
  return (
    <>
      <MainAdminPageSection/>
    </>
  );
};

export default AdminPage;