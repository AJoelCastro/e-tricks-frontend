import Image from 'next/image';
import React, { useState } from 'react'
import Carousel from 'react-bootstrap/Carousel';
const MainCarouselComponent = () => {
    const [index, setIndex] = useState<number>(0);

    const handleSelect = (selectedIndex: number) => {
        setIndex(selectedIndex);
    };
    return (
        <Carousel activeIndex={index} onSelect={handleSelect}>
            <Carousel.Item>
                <Image
                    src="https://www.bata.com/dw/image/v2/BCLG_PRD/on/demandware.static/-/Sites-bata-pe-Library/es_PE/dw8313b680/homepage/PAPAHOME.jpg?sw=2560&q=80"
                    alt="First slide"
                    width={1920}
                    height={1080}
                    priority
                    style={{ objectFit: 'cover' }}
                />
                <Carousel.Caption>
                <h3>First slide label</h3>
                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <Image
                    src="https://www.bata.com/dw/image/v2/BCLG_PRD/on/demandware.static/-/Sites-bata-pe-Library/es_PE/dw8313b680/homepage/PAPAHOME.jpg?sw=2560&q=80"
                    alt="First slide"
                    width={1920}
                    height={1080}
                    priority
                />
                <Carousel.Caption>
                <h3>Second slide label</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <Image
                    src="https://www.bata.com/dw/image/v2/BCLG_PRD/on/demandware.static/-/Sites-bata-pe-Library/es_PE/dw8313b680/homepage/PAPAHOME.jpg?sw=2560&q=80"
                    alt="First slide"
                    width={1920}
                    height={1080}
                    priority
                />
                <Carousel.Caption>
                <h3>Third slide label</h3>
                <p>
                    Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                </p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    )
}

export default MainCarouselComponent
