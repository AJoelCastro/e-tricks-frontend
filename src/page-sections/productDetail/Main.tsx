import React, { useEffect, useState } from 'react';
import ProductService from '@/services/ProductService';
import { Box, Button, CircularProgress, Grid, Rating, Typography } from '@mui/material';
import { IProduct } from '@/interfaces/Product';
import Link from 'next/link';

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
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    const promedio =
        product?.resenias && product?.resenias.length
        ? product?.resenias.map(r => r.valoracion).reduce((a, b) => a + b, 0) / product?.resenias.length
        : 0;
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
            <Grid container spacing={1} sx={{minHeight:'100vh', backgroundColor:'white', marginY:1, mx:{xs: 1, sm: 4, md: 8 }, borderRadius:4, marginBottom:4}}>

                {
                    loading ? (
                        <Grid sx={{display:'flex', justifyContent:'center', alignItems:'center'}} size={12}>
                            <CircularProgress sx={{
                                color: 'black',
                            }} />
                        </Grid>
                    ):(
                        <>
                            <Grid container size={{xs:12, sm:12, md:8}} sx={{display:'flex', flexDirection:'row'}}>
                                <Grid size={{xs:12, sm:8, md:6}}sx={{ marginX:'auto', marginY:'auto' }} >
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
                                <Grid size={{xs:12, sm:12, md:12}}sx={{ marginX:4, marginY:'auto' }} >
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, backgroundColor:'#f5f5f5' }}>
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
                                <Grid size={{xs:12, sm:12, md:12}} sx={{backgroundColor:'cyan'}}>
                                </Grid>
                            </Grid>
                            <Grid size={{xs:12, sm:12, md:4}} sx={{ py:{xs:0, sm:2, md:4}, px:{xs:2, sm:1, md:0}}} spacing={2}>
                                <Grid size={{xs:12, sm:12, md:12}} sx={{backgroundColor:'white'}}>
                                    <Link href={`/marcas/${product?.marca.toLowerCase()}`}>
                                        <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                                            {product?.marca}
                                        </Typography>
                                    </Link>
                                    <Grid container spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                                        <Grid>
                                            <Typography variant="h3" sx={{ color: 'text.primary' }}>
                                                {product?.name}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={1} sx={{ display:'flex', alignItems: 'center', mt: 1 }}>
                                        <Rating precision={0.5} value={promedio} readOnly />
                                        <Typography variant="body1" color="text.secondary" fontSize="14px">
                                            {product?.resenias?.length ?? 0} reseñas
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid
                                    size={{ xs: 12, sm: 12, md: 12 }}
                                    sx={{
                                        backgroundColor: 'white',
                                        display: 'flex',
                                        flexWrap: 'wrap', // 👈 permite que pasen a otra fila
                                        justifyContent: 'start', // o 'center' si prefieres centrado
                                        gap: 1, // espacio entre botones
                                        marginTop:2,
                                        marginBottom:1
                                    }}
                                >
                                    {product?.size.map((s) => (
                                        <Box
                                        key={s}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        >
                                        <Button
                                            onClick={() => setSelectedSize(s)}
                                            variant={selectedSize === s ? 'contained' : 'text'}
                                            color={selectedSize === s ? 'primary' : 'inherit'}
                                            sx={{
                                            boxShadow: 3, // 👈 sombra
                                            minWidth: 80,
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: selectedSize === s ? 'white' : 'text.primary',
                                                    fontSize: 13,
                                                }}
                                            >
                                                {s} US
                                            </Typography>
                                        </Button>
                                        </Box>
                                    ))}
                                </Grid>
                                <Typography
                                    component="span"
                                    color="text.secondary"
                                    sx={{
                                        fontSize: 13,
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                        '&:hover': {
                                        color: 'primary.main',
                                        },
                                    }}
                                    onClick={() => {console.log("pressed")}}
                                >
                                    Guía de tallas
                                </Typography>

                                <Grid size={{xs:12, sm:12, md:12}} sx={{backgroundColor:'white'}}>

                                </Grid>
                                <Grid size={{xs:12, sm:12, md:12}} sx={{backgroundColor:'white'}}>

                                </Grid>
                                <Grid size={{xs:12, sm:12, md:12}} sx={{backgroundColor:'white'}}>

                                </Grid>
                                <Grid size={{xs:12, sm:12, md:12}} sx={{backgroundColor:'white'}}>

                                </Grid>
                            </Grid>
                        </>
                    )
                }
            </Grid>
        </>
    )
}

export default MainProductDetail
