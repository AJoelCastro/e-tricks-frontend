import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Image = {
  title: string;
  url: string;
  to: string;
};

type Props = {
  image: Image;
};

const ThreeImages: React.FC<Props> = ({ image }) => {
  return (
    <Box sx={{ position: 'relative' }}>
      <Link href={image.to}>
        <Image
          src={image.url}
          alt="Next.js logo"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <Box
          className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/35 transition flex-col gap-3"
        >
          <Typography
            className="text-white text-sm font-semibold bg-opacity-40 hover:bg-opacity-60 transition bg-red-600 px-3 py-1 rounded-sm"
            sx={{ pointerEvents: 'none', color: 'white', fontFamily:'monospace'  }}
          >
            HASTA -40% OFF
          </Typography>
          <Typography
            variant='h2'
            sx={{ pointerEvents: 'none', color: 'white', fontFamily:'monospace' }}
          >
            {image.title}
          </Typography>
        </Box>
      </Link>
    </Box>
  );
};

export default ThreeImages;
