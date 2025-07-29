import FooterComponent from '@/components/principal/FooterComponent'
import NavbarComponent from '@/components/principal/NavbarComponent'
import TermsAndConditions from '@/components/TermsAndConditions'
import React from 'react'

const TermsAndConditionsPage = () => {
  return (
    <>
      <NavbarComponent/>
      <br/>
      <br/>
      <TermsAndConditions/>
      <FooterComponent/>
    </>
  )
}

export default TermsAndConditionsPage
