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
      spacing: 15,
    },
  });

  useEffect(() => {
    // Iniciar autoplay
    timerRef.current = setInterval(() => {
      if (instanceRef.current) {
        instanceRef.current.next();
      }
    }, 4000); // Cambia cada 3 segundos

    // Limpiar intervalo al desmontar
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [instanceRef]);

  return (
    <Box ref={sliderRef} className="keen-slider">
      {images.map((image, index) => (
        <div key={index} className="keen-slider__slide flex items-center justify-center relative">
          <Image
            src={image}
            alt={`image-${index}`}
            width={1920}
            height={1080}
            priority
          />
        </div>
      ))}
    </Box>
  );
};

export default Carousel;
