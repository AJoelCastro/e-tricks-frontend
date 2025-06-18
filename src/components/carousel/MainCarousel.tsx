'use client';

import React, { useRef } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import Image from 'next/image';
import { Box, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

export default function Carousel() {
  const sliderRef = useRef(null);
  const [sliderInstanceRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1,
      spacing: 15,
    },
  });

  const handlePrev = () => {
    if (slider) slider.prev();
  };

  const handleNext = () => {
    if (slider) slider.next();
  };

  return (
    <Box position="relative" width="100%" overflow="hidden">
      <Box
        ref={(ref) => {
          sliderRef.current = ref;
          sliderInstanceRef(ref);
        }}
        className="keen-slider"
      >
        {[
          'https://www.bata.com/dw/image/v2/BCLG_PRD/on/demandware.static/-/Sites-bata-pe-Library/es_PE/dwac99c941/homepage/BannerHero_Mobile_Campa%C3%B1aPapa2905.jpg?sw=2560&q=80',
          'https://www.bata.com/dw/image/v2/BCLG_PRD/on/demandware.static/-/Sites-bata-pe-Library/es_PE/dwac99c941/homepage/BannerHero_Mobile_Campa%C3%B1aPapa2905.jpg?sw=2560&q=80',
        ].map((src, index) => (
          <Box
            key={index}
            className="keen-slider__slide"
            display="flex"
            justifyContent="center"
            alignItems="center"
            position="relative"
            height={{ xs: 200, md: 400 }}
          >
            <Image
              src={src}
              alt={`image-${index}`}
              layout="fill"
              objectFit="cover"
              priority
            />
          </Box>
        ))}
      </Box>

      {/* Controles de navegación */}
      <IconButton
        onClick={handlePrev}
        sx={{
          position: 'absolute',
          top: '50%',
          left: 16,
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255,255,255,0.7)',
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
        }}
      >
        <ArrowBackIos />
      </IconButton>

      <IconButton
        onClick={handleNext}
        sx={{
          position: 'absolute',
          top: '50%',
          right: 16,
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255,255,255,0.7)',
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
        }}
      >
        <ArrowForwardIos />
      </IconButton>
    </Box>
  );
}
