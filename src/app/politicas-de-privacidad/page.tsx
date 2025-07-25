import FooterComponent from '@/components/FooterComponent'
import NavbarComponent from '@/components/NavbarComponent'
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
