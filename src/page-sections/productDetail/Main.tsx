import React, { useEffect, useState } from 'react';
import ProductService from '@/services/ProductService';
import { Box, Button, CircularProgress, Grid, Rating, Typography } from '@mui/material';
import { IProduct } from '@/interfaces/Product';
import Link from 'next/link';
import { Zap, TruckElectric, Store } from 'lucide-react';
// react hook form
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { FormProvider } from '@/components/form'
import { yupResolver } from '@hookform/resolvers/yup';
import UserService from '@/services/UserService';
type Props = {
  id: string;
};

const schema = Yup.object().shape({
    size : Yup.string().required('La talla es requerida'),
    productId: Yup.string().required(),
    quantity: Yup.number().required().min(1).max(12),
})

const MainProductDetail: React.FC<Props> = ({ id }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [product, setProduct] = useState<IProduct>();
    const [images, setImages] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    const promedio =
        product?.resenias && product?.resenias.length
        ? product?.resenias.map(r => r.valoracion).reduce((a, b) => a + b, 0) / product?.resenias.length
        : 0;

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            productId: id, // 👈 ya se pasa directamente
            quantity: 1    // también puedes establecer cantidad inicial aquí
        }
    })
    const {handleSubmit, setValue, formState:{ isSubmitting }} = methods;

    const handleSubmitForm = handleSubmit(async(values)=>{
        try {
            const dataAdd = await UserService.addCartItem(values.productId, values.quantity, values.size);
            console.log(dataAdd)
        } catch (error) {
            throw error
        }
    })
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
    useEffect(() => {
        if (selectedSize) {
            setValue('size', selectedSize); // asegura que sea number si el schema lo espera así
        }
    }, [selectedSize, setValue]);
    useEffect(() => {
        setValue('quantity', quantity);
    }, [quantity, setValue]);

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
                                <FormProvider methods={methods} onSubmit={handleSubmitForm}>
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
                                    {methods.formState.errors.size && (
                                        <Typography color="error" variant="body2" sx={{fontFamily:'cursive'}}>
                                            {methods.formState.errors.size.message}!
                                        </Typography>
                                    )}
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

                                    <Grid size={{xs:12, sm:12, md:12}} sx={{}}>
                                        {product?.descuento ? (
                                            <Box mt={2}>
                                                <Grid container spacing={8} alignItems="center">
                                                    <Grid >
                                                        <Typography sx={{ color: 'text.primary', fontSize:22, fontFamily:'cursive' }}>
                                                            S/ {product?.price}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid sx={{ backgroundColor: 'red', borderRadius: '6px', px: 1.5, py:0.4 }}>
                                                        <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                                                            -{product?.descuento}%
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                    color: 'text.secondary',
                                                    textDecoration: 'line-through',
                                                    fontSize: '14px',
                                                    }}
                                                >
                                                    S/ {product?.price + (product?.price * product?.descuento) / 100}
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Typography  sx={{ color: 'text.primary', mt: 2 , fontSize:22, fontFamily:'cursive' }}>
                                                S/ {product?.price}
                                            </Typography>
                                        )}
                                    </Grid>
                                    <Grid size={{xs:12, sm:12, md:12}} sx={{ marginY:2}}>
                                        <Box sx={{backgroundColor:'#69db7c', paddingX:2, paddingY:1, borderRadius:2, width: 'fit-content', display:'flex', gap:2}}>
                                            <Typography color='white' sx={{fontFamily:'revert', fontSize:15}}>
                                                Envío en 180 minutos (Trujillo)
                                            </Typography>
                                            <Zap color='white' size={18}/>
                                        </Box>
                                    </Grid>
                                    <Grid size={{xs:12, sm:12, md:12}} sx={{backgroundColor:'white'}}>
                                        {/* contador de unidades y boton de agregar al carro */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                border: '1px solid #ccc',
                                                borderRadius: 2,
                                                px: 1,
                                                backgroundColor: '#f9f9f9'
                                            }}>
                                                <Button
                                                    size="small"
                                                    sx={{ minWidth: 0, padding: '4px 8px' }}
                                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                                >
                                                    -
                                                </Button>
                                                <Typography sx={{ mx: 1 }}>
                                                    {quantity}
                                                </Typography>
                                                <Button
                                                    size="small"
                                                    sx={{ minWidth: 0, padding: '4px 8px' }}
                                                    onClick={() => setQuantity(prev => Math.min(12, prev + 1))}
                                                >
                                                    +
                                                </Button>
                                            </Box>
                                            <Typography sx={{ fontSize: 13, color: 'gray' }}>MÁXIMO 12 UNIDADES</Typography>
                                        </Box>

                                        <Button
                                            fullWidth
                                            sx={{
                                                mt: 2,
                                                backgroundColor: '#adb5bd',
                                                color: 'white',
                                                fontWeight: 'bold',
                                                fontSize: 16,
                                                borderRadius: 2,
                                                paddingY: 1.5,
                                                '&:hover': {
                                                    backgroundColor: '#868e96'
                                                }
                                            }}
                                            type="submit"  
                                            loading={isSubmitting}
                                        >
                                            AGREGAR AL CARRO
                                        </Button>
                                    </Grid>
                                </FormProvider>
                                <Grid size={{xs:12, sm:12, md:12}} sx={{ pX:{xs:0,sm:1,md:2}}}>
                                    {/* el cuadro de envio a domicilio y retiro en punto */}
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mt: 3,
                                        border: '1px solid #69db7c',
                                        borderRadius: 3,
                                        py: 1,
                                        px: 2
                                    }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '50%' }}>
                                            <TruckElectric size={24} />
                                            <Typography variant='overline' sx={{ fontSize: 14 }}>
                                                ENVÍO A DOMICILIO
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '50%' }}>
                                            <Store size={24} />
                                            <Typography variant='overline' sx={{ fontSize: 14 }}>
                                                RETIRO EN UN PUNTO
                                            </Typography>
                                        </Box>
                                    </Box>
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
