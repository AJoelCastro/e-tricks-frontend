import FooterComponent from '@/components/principal/FooterComponent'
import NavbarComponent from '@/components/principal/NavbarComponent'
import PrivacyPolicy from '@/components/PrivacyPolicy'
import React from 'react'

const PrivacyPolicyPage = () => {
  return (
    <>
      <NavbarComponent/>
      <br/>
      <br/>
      <PrivacyPolicy/>
      <FooterComponent/>
    </>
  )
}

export default PrivacyPolicyPage
