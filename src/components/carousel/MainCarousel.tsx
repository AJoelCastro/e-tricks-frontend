'use client';
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import Image from 'next/image';
import { Box } from '@mui/material';


type CarouselProps = {  
  images: string[];
};
const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: 'free',
    slides: {
      perView: 1,
      spacing: 15,
    },
  });

  return (
    <Box ref={sliderRef} className="keen-slider" >
      {
        images.map((image, index) => (
          <div key={index} className="keen-slider__slide flex items-center justify-center relative">
            <Image
              src={image}
              alt={`image-${index}`}
              width={1920}
              height={1080}
              priority
            />
          </div>
        ))
      }
        {/* <div className="keen-slider__slide  flex items-center justify-center relative">
            <Image
                src={'https://www.bata.com/dw/image/v2/BCLG_PRD/on/demandware.static/-/Sites-bata-pe-Library/es_PE/dwac99c941/homepage/BannerHero_Mobile_Campa%C3%B1aPapa2905.jpg?sw=2560&q=80'}
                alt='imagePrueba'
                width={1920}
                height={1080}
                priority
            >
            </Image>
            <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a href="#slide1" className="btn btn-circle">❮</a>
                <a href="#slide3" className="btn btn-circle">❯</a>
            </div>
        </div>
        <div className="keen-slider__slide  flex items-center justify-center relative">
            <Image
                src={'https://www.bata.com/dw/image/v2/BCLG_PRD/on/demandware.static/-/Sites-bata-pe-Library/es_PE/dwac99c941/homepage/BannerHero_Mobile_Campa%C3%B1aPapa2905.jpg?sw=2560&q=80'}
                alt='imagePrueba'
                width={1920}
                height={1080}
                priority
            >
            </Image>
        </div> */}
    </Box>
  );
}
export default Carousel;