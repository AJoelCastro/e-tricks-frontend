import React from 'react'

const FooterComponent = () => {
  return (
    <div className='flex-row'>
      <div className=''>

      </div>
      <div className='grid grid-cols-4'>
        <div className='col-span-1'>
          <h1>About</h1>
          <ul>
            <li>About Us</li>
            <li>Contact Us</li>
            <li>Careers</li>
            <li>Blog</li>
          </ul>
        </div>
        <div className='col-span-1'>
          <h1>Support</h1>
          <ul>
            <li>Help Center</li>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
            <li>Legal</li>
          </ul>
        </div>
        <div className='col-span-1'>
          <h1>Community</h1>
          <ul>
            <li>Twitter</li>    
            <li>Facebook</li>
            <li>Instagram</li>
            <li>LinkedIn</li>
          </ul>
        </div>
        <div className='col-span-1'>
          <h1>Newsletter</h1>
          <ul>
            <li>Subscribe to our newsletter</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default FooterComponent
