'use client';
import React from 'react';
import NavbarComponent from '@/components/NavbarComponent';
import FooterComponent from '@/components/FooterComponent';
import MainAddresses from '@/page-sections/addresses/main';

const AddressesPage = () => {
  return (
    <>
      <NavbarComponent />
      <MainAddresses/>
      <FooterComponent />
    </>
  );
};

export default AddressesPage;