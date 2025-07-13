import React, { useEffect, useState } from 'react';
import ProductService from '@/services/ProductService';
import { Box, CircularProgress, Grid } from '@mui/material';
import { IProduct } from '@/interfaces/Product';

type Props = {
  id: string;
};

const MainProductDetail: React.FC<Props> = ({ id }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [product, setProduct] = useState<IProduct>();
    const [images, setImages] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});

    const getProduct = async () => {
        try {
        setLoading(true);
        const dataProduct = await ProductService.GetProductById(id);
        setProduct(dataProduct);
        setImages(dataProduct?.images || []);
        setSelectedImage(dataProduct?.images[0]);
        setLoading(false);
        } catch (error) {
        throw error;
        }
    };

    useEffect(() => {
        getProduct();
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setZoomStyle({
        backgroundPosition: `${x}% ${y}%`
        });
    };
    
    return (
        <>
            <div className='h-16'></div>
            <Grid container spacing={1} sx={{minHeight:'100vh'}}>
                {
                    loading ? (
                        <Grid sx={{display:'flex', justifyContent:'center', alignItems:'center'}} size={12}>
                            <CircularProgress sx={{
                                color: 'black',
                            }} />
                        </Grid>
                    ):(
                        <>
                            <Grid container size={{xs:12, sm:6, md:8}} sx={{display:'flex', flexDirection:'row'}}>
                                <Grid size={{xs:12, sm:6, md:6}}sx={{ marginX:'auto', marginY:'auto' }} >
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            width: '100%',
                                            height: 500,
                                            backgroundImage: `url(${selectedImage})`,
                                            backgroundSize: isZoomed ? '200%' : 'contain',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'center',
                                            cursor: 'zoom-in',
                                            padding:2,
                                            transition: 'background-position 0.2s',
                                            ...zoomStyle
                                        }}
                                        onMouseMove={(e) => {
                                            handleMouseMove(e);
                                            setIsZoomed(true); // 👈 activa zoom
                                        }}
                                        onMouseLeave={() => {
                                            setZoomStyle({ backgroundPosition: 'center' });
                                            setIsZoomed(false); // 👈 desactiva zoom
                                        }}
                                    >
                                    </Box>
                                </Grid>
                                <Grid size={{xs:12, sm:6, md:12}}sx={{ marginX:4, marginY:'auto' }} >
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, backgroundColor:'white' }}>
                                        {images.map((img, idx) => (
                                            <Box
                                                key={idx}
                                                component="img"
                                                src={img}
                                                alt={`thumb-${idx}`}
                                                onClick={() => setSelectedImage(img)}
                                                sx={{
                                                    width: 60,
                                                    height: 60,
                                                    objectFit: 'cover',
                                                    border: selectedImage === img ? '2px solid black' : '1px solid #ccc',
                                                    cursor: 'pointer'
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Grid>
                                <Grid size={{xs:12, sm:6, md:12}} sx={{backgroundColor:'cyan'}}>
                                </Grid>
                            </Grid>
                            <Grid size={{xs:12, sm:6, md:4}}>
                            </Grid>
                        </>
                    )

                }
                
            </Grid>
        </>
    )
}

export default MainProductDetail
