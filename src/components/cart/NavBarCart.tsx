import { Box, Typography } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const NavBarCart = () => {
  return (
    <Box sx={{width: '100%',  display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
        <Box sx={{}}>
          <Link href={'/'}>
            <Image src={'https://tricks-bucket.s3.us-east-2.amazonaws.com/logos/logo_horizontal.svg'} alt='Yape' width={150} height={60} />
          </Link>
        </Box>
        <Box>
            <Typography variant='yapeSteps' sx={{textAlign: 'center'}}>
                ¿Necesitas ayuda? Escribenos al WhatsApp <a href='https://wa.me/51969742589' className='text-[#7950f2]'>+51 969 742 589</a>
            </Typography>
        </Box>
    </Box>
  )
}

export default NavBarCart
