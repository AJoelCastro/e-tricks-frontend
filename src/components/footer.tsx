import React from 'react'
import Image from "next/image";
const FooterComponent = () => {
  return (
    <div className='flex-row'>
        {/* primera seccion */}
      <div className='flex flex-row'>
        <Image
        className="dark:invert"
        src="/next.svg"
        alt="Next.js logo"
        width={180}
        height={38}
        priority
        />
        <div>
          <p className="text-gray-600">
            <span className="text-gray-900">Next.js</span> is a minimalistic
            framework for building fast web applications.
          </p>
        </div>
      </div>
      {/* segunda sección */}
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
