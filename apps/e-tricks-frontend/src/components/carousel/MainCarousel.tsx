'use client';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import Image from 'next/image';
import { Box } from '@mui/material';
import React, { useEffect, useRef } from 'react';

type CarouselProps = {
  images: string[];
};

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: 'free',
    slides: {
      perView: 1,
      spacing: 0,
    },
  });

  useEffect(() => {
    timerRef.current = setInterval(() => {
      instanceRef.current?.next();
    }, 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <Box
      ref={sliderRef}
      className="keen-slider"
      sx={{
        width: '100vw',
        height:'100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {images.map((image, index) => (
        <Box
          key={index}
          className="keen-slider__slide"
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
          }}
        >
          <Image
            src={image}
            alt={`image-${index}`}
            fill
            priority
            style={{
              objectFit: 'cover',
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default Carousel;
