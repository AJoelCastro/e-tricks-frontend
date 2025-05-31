import Image from 'next/image';
import React, { useState } from 'react'
const MainCarouselComponent = () => {
    const [index, setIndex] = useState<number>(0);

    const handleSelect = (selectedIndex: number) => {
        setIndex(selectedIndex);
    };
    return (
        <></>
    )
}

export default MainCarouselComponent
