import React, { useCallback, useEffect, useState } from 'react';
import ProductService from '@/services/ProductService';
import { Box, Button, CircularProgress, Grid, IconButton, Rating, Typography } from '@mui/material';
import { IProduct } from '@/interfaces/Product';
import Link from 'next/link';
import { Zap, TruckElectric, Store } from 'lucide-react';
import { Snackbar, Alert } from '@mui/material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
// react hook form
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { FormProvider } from '@/components/form'
import { yupResolver } from '@hookform/resolvers/yup';
import UserService from '@/services/UserService';
import { primary } from '@/theme/colors';
import Image from 'next/image';
import { SignInButton, useAuth } from '@clerk/nextjs';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { CheckCircle } from 'lucide-react';
import NavbarComponent from '@/components/principal/NavbarComponent';
import FooterComponent from '@/components/principal/FooterComponent';
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
    const [favoriteIds, setFavoriteIds] = useState<Array<string>>([]);
    const [quantity, setQuantity] = useState<number>(1);
    const [openSizeGuide, setOpenSizeGuide] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info' | 'warning';
    }>({ open: false, message: '', severity: 'info' });
    const [openModal, setOpenModal] = useState(false);
    const [lastAddedProduct, setLastAddedProduct] = useState<IProduct | null>(null);
    const { getToken, isSignedIn } = useAuth();
    const promedio =
        product?.resenias && product?.resenias.length
        ? product?.resenias.map(r => r.valoracion).reduce((a, b) => a + b, 0) / product?.resenias.length
        : 0;

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            productId: id, 
            quantity: 1  
        }
    })
    const {handleSubmit, setValue, formState:{ isSubmitting }} = methods;

    const handleSubmitForm = handleSubmit(async(values)=>{
        try {
            const token = await getToken();
            await UserService.addCartItem(token as string, values.productId, values.quantity, values.size);
            setLastAddedProduct(product??null); // Guarda el producto actual para mostrarlo
            setOpenModal(true); // Abre el modal
        } catch (error) {
            handleShowSnackbar(`${error}`,'error');
        }
    })
    const getProduct = async () => {
        try {
            setLoading(true);
            const dataProduct = await ProductService.GetProductById(id);
            console.log('dataProduct', dataProduct);
            setProduct(dataProduct);
            setImages(dataProduct?.images || []);
            setSelectedImage(dataProduct?.images[0]);
        } catch (error) {
            handleShowSnackbar(`${error}`,'error');
        }finally {
            setLoading(false);
        }
    };
    const getFavorites = async () => {
        try {
            if (!isSignedIn) return;
            setLoading(true);
            const token = await getToken();
            const data = await UserService.getFavoriteIds(token as string);
            setFavoriteIds(data);
        } catch (error) {
            handleShowSnackbar(`${error}`, 'error');
        }finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getFavorites();
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

    const handleShowSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleRemoveFavorite = async () => {
        try {
            const token = await getToken();
            await UserService.removeFavorite(token as string,id)
            getFavorites();
        } catch (error) {
            throw error
        }
    }


    const handleAddFavorite = async() => {
        try {
            const token = await getToken();
            await UserService.addFavorite(token as string,id)
            getFavorites();
        } catch (error) {
            throw error
        }
    }
        
    if(loading){
        return(
            <Grid size={{
                xs: 12, sm: 12, md: 12
            }} 
            sx={{ textAlign: 'center', mt: 4 }}
            >
                <CircularProgress/>
            </Grid>
        )
    }
    return (
        <>  <NavbarComponent/>
            <div className='h-16'></div>
            <Grid container spacing={1} sx={{minHeight:'100vh', backgroundColor:'white', marginY:1, mx:{xs: 1, sm: 4, md: 8 }, borderRadius:4, marginBottom:4}}>
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
                    </Grid>
                    <Grid size={{xs:12, sm:12, md:4}} sx={{ py:{xs:0, sm:2, md:4}, px:{xs:2, sm:1, md:0}}} spacing={2}>
                        <FormProvider methods={methods} onSubmit={handleSubmitForm}>
                            <Grid size={{xs:12, sm:12, md:12}} sx={{backgroundColor:'white'}}>
                                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between',  paddingRight:4}}>
                                    <Link href={`/marcas/${product?.brand.name.toLowerCase()}`}>
                                        <Typography variant="marcaDetail" sx={{ color: 'text.primary' }}>
                                            {product?.brand.name}
                                        </Typography>
                                    </Link>
                                    <Box >
                                        {
                                            isSignedIn ? (
                                            <IconButton aria-label="add to favorites" onClick={()=>{
                                                if (favoriteIds.includes(id)) {
                                                    handleRemoveFavorite();
                                                } else {
                                                    handleAddFavorite();
                                                }
                                            }}>
                                                <FavoriteBorderIcon
                                                sx={{
                                                    color: favoriteIds.includes(id) ? 'red' : 'inherit',
                                                    '&:hover': {
                                                    color: 'red',
                                                    cursor: 'pointer',
                                                    },
                                                }}
                                                />
                                            </IconButton>
                                            ) : (
                                            <SignInButton mode='modal'>
                                                <button className='px-2'>
                                                    <FavoriteBorderIcon
                                                        sx={{
                                                        color: favoriteIds.includes(id) ? 'red' : 'inherit',
                                                        '&:hover': {
                                                            color: 'red',
                                                            cursor: 'pointer',
                                                        },
                                                        }}
                                                    />
                                                </button>
                                            </SignInButton>
                                            )
                                        }
                                        </Box>
                                </Box>
                                <Grid container spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                                    <Grid>
                                        <Typography variant="nameDetail" sx={{ color: 'text.primary' }}>
                                            {product?.name}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} sx={{ display:'flex', alignItems: 'center', mt: 1 }}>
                                    <Rating precision={0.5} value={promedio} readOnly />
                                    <Typography variant="reseniasDetail" color="text.secondary" >
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
                                {product?.stockPorTalla.map((s) => (
                                    <Box
                                    key={s.talla}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    >
                                    <Button
                                        onClick={() => setSelectedSize(s.talla.toString())}
                                        variant={selectedSize === s.talla.toString() ? 'contained' : 'text'}
                                        color={selectedSize === s.talla.toString() ? 'primary' : 'inherit'}
                                        sx={{
                                        boxShadow: 3, // 👈 sombra
                                        minWidth: 80,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: selectedSize === s.talla.toString() ? 'white' : 'text.primary',
                                                fontSize: 12,
                                            }}
                                        >
                                            {s.talla} US
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
                                onClick={() => setOpenSizeGuide(true)}
                            >
                                Guía de tallas
                            </Typography>

                            <Grid size={{xs:12, sm:12, md:12}} sx={{}}>
                                {product?.descuento ? (
                                    <Box mt={2}>
                                        <Grid container spacing={8} alignItems="center">
                                            <Grid >
                                                <Typography variant='priceDetail' sx={{ color: 'text.primary' }}>
                                                    S/ {product?.price}
                                                </Typography>
                                            </Grid>
                                            <Grid sx={{ backgroundColor: 'red', borderRadius: '6px', px: 1.5, py:0.4 }}>
                                                <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                                                    -{product?.descuento}%
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                            color: 'text.secondary',
                                            textDecoration: 'line-through',
                                            fontSize: '13px',
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
                                    <Typography color='white' sx={{fontFamily:'revert', fontSize:14}}>
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
                                    <Typography sx={{ fontSize: 12, color: 'gray' }}>MÁXIMO 12 UNIDADES</Typography>
                                </Box>
                                <Box sx={{paddingRight:2}}>
                                    <Button
                                        sx={{
                                            mt: 2,
                                            backgroundColor: '#7950f2',
                                            color: 'white',
                                            width: '100%',
                                            marginRight:2,
                                            fontWeight: 'bold',
                                            fontSize: 16,
                                            borderRadius: 2,
                                            paddingY: 1.5,
                                            ":hover": {
                                                backgroundColor: '#5f3dc4',
                                                color: 'white'
                                            }
                                        }}
                                        type="submit"  
                                        loading={isSubmitting}
                                    >
                                        <Typography sx={{ fontSize: 14, fontWeight: 'bold' }}>
                                            AGREGAR AL CARRO
                                        </Typography>
                                    </Button>
                                </Box>
                            </Grid>
                        </FormProvider>
                        <Grid size={{xs:12, sm:12, md:12}} sx={{ pX:{xs:0,sm:1,md:2}}}>
                            {/* el cuadro de envio a domicilio y retiro en punto */}
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mt: 3,
                                borderRadius: 3,
                                py: 1,
                                px: 2,
                                mx: 2
                            }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '50%' }}>
                                    <TruckElectric size={20} color={primary.main}/>
                                    <Typography variant='overline' sx={{ fontSize: 12, color:'primary.main' }}>
                                        ENVÍO A DOMICILIO
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '50%' }}>
                                    <Store size={20} color={primary.main}/>
                                    <Typography variant='overline' sx={{ fontSize: 12, color:'primary.main' }}>
                                        RETIRO EN UN PUNTO
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                    
                </>
            </Grid>
            <Grid container sx={{backgroundColor:'white', mx:{xs: 1, sm: 4, md: 8 }, borderRadius:4, marginBottom:4}}>
                <Grid size={{xs:12, sm:12, md:12}} sx={{ borderRadius: 2, p: 3, mt: 4, mx:{xs:1,sm:2,md:4}, mb:{xs:2,sm:2,md:4} }}>
                    
                    <Grid container spacing={4}>
                        {/* Columna de Especificaciones */}
                        <Grid size={{xs:12, sm:12, md:6}}>
                            <Typography variant="h6" sx={{ mb: 3 }}>
                            Especificaciones
                            </Typography>
                            
                            {/* Separador */}
                            <Box sx={{ width: '100%', height: 2, backgroundColor: '#e0e0e0', mb: 3 }} />
                            
                            {/* Tabla de especificaciones con efecto de recorte y blur */}
                            <Box
                            sx={{
                                position: 'relative',
                                maxHeight: expanded ? 'none' : 240,
                                overflow: 'hidden',
                                transition: 'max-height 0.3s ease, filter 0.3s ease',
                            }}
                            >
                            <Box 
                                sx={{ 
                                borderRadius: 2, 
                                overflow: 'hidden', 
                                border: '1px solid #e0e0e0',
                                filter: expanded ? 'none' : 'blur(1px)',
                                transition: 'filter 0.3s ease',
                                }}
                            >
                                {product?.caracteristicas?.map((item, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                    display: 'flex',
                                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                                    minHeight: 48,
                                    alignItems: 'center'
                                    }}
                                >
                                    {/* Nombre de la característica */}
                                    <Box sx={{ 
                                    flex: '0 0 40%', 
                                    p: 2, 
                                    borderRight: '1px solid #e0e0e0'
                                    }}>
                                    <Typography variant="body2" sx={{ fontSize: 14, color: '#333', fontWeight: 'bold' }}>
                                        {item.nombre.replace(/\*\*/g, '')}
                                    </Typography>
                                    </Box>
                                    
                                    {/* Valor de la característica */}
                                    <Box sx={{ flex: 1, p: 2 }}>
                                    <Typography variant="body2" sx={{ fontSize: 14, color: '#666' }}>
                                        {item.valor}
                                    </Typography>
                                    </Box>
                                </Box>
                                ))}
                            </Box>

                            {/* Overlay gradiente para las especificaciones */}
                            {!expanded && (
                                <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: '80px',
                                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.0), rgba(255,255,255,0.7), rgba(255,255,255,1))',
                                    pointerEvents: 'none',
                                }}
                                />
                            )}
                            </Box>
                        </Grid>

                        {/* Columna de Información Adicional */}
                        <Grid size={{xs:12, sm:12, md:6}}>
                            <Typography variant="h6" sx={{  mb: 3 }}>
                            Información adicional
                            </Typography>
                            
                            {/* Separador */}
                            <Box sx={{ width: '100%', height: 2, backgroundColor: '#e0e0e0', mb: 3 }} />
                            
                            {/* Descripción del producto con efecto de recorte y blur */}
                            <Box
                            sx={{
                                position: 'relative',
                                maxHeight: expanded ? 'none' : 120,
                                overflow: 'hidden',
                                transition: 'max-height 0.3s ease, filter 0.3s ease',
                            }}
                            >
                            <Typography variant="body2" sx={{ 
                                fontSize: 14, 
                                lineHeight: 1.6, 
                                color: '#666',
                                textAlign: 'justify',
                                filter: expanded ? 'none' : 'blur(1px)',
                                transition: 'filter 0.3s ease',
                            }}>
                                {product?.description || 'Información del producto no disponible'}
                            </Typography>
                            
                            {/* Overlay gradiente para la descripción */}
                            {!expanded && (
                                <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: '60px',
                                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.0), rgba(255,255,255,0.7), rgba(255,255,255,1))',
                                    pointerEvents: 'none',
                                }}
                                />
                            )}
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Botón Ver más centrado para ambas columnas */}
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setExpanded(prev => !prev)}
                        sx={{ 
                        textTransform: 'none', 
                        fontWeight: 500,
                        borderRadius: '50px',
                        px: 4,
                        py: 1
                        }}
                    >
                        {expanded ? 'Ver menos' : 'Ver más'}
                    </Button>
                    </Box>
                </Grid>
            </Grid>
            {/* aqui va la seccion de reseñas */}
            <Grid container sx={{backgroundColor:'white', mx:{xs: 1, sm: 4, md: 8 }, borderRadius:4, marginBottom:4}}>
                <Grid size={{xs:12, sm:12, md:12}} sx={{ borderRadius: 2, p: 3, mt: 4, mx:{xs:1,sm:2,md:4}, mb:{xs:2,sm:2,md:4} }}>
                    
                    {/* Título de la sección */}
                    <Typography variant="h6" sx={{  mb: 3 }}>
                        Comentarios de este producto
                    </Typography>
                    
                    {/* Separador */}
                    <Box sx={{ width: '100%', height: 2, backgroundColor: '#e0e0e0', mb: 4 }} />
                    
                    <Grid container spacing={4}>
                        {/* Columna izquierda - Resumen de calificaciones */}
                        <Grid size={{xs:12, sm:12, md:4}}>
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                {/* Promedio y estrellas */}
                                <Typography variant="h2" sx={{ fontWeight: 'bold', fontSize: '3rem', mb: 1 }}>
                                    {promedio.toFixed(1)}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                                    /5
                                </Typography>
                                
                                <Rating 
                                    value={promedio} 
                                    precision={0.1} 
                                    readOnly 
                                    sx={{ fontSize: '1.5rem', mb: 2 }}
                                />
                                
                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                                    {product?.resenias?.length || 0} comentarios
                                </Typography>

                                {/* Distribución de estrellas */}
                                <Box sx={{ mt: 3 }}>
                                    {[5, 4, 3, 2, 1].map((stars) => {
                                        const count = product?.resenias?.filter(r => r.valoracion === stars).length || 0;
                                        const percentage = product?.resenias?.length ? (count / product.resenias.length) * 100 : 0;
                                        
                                        return (
                                            <Box key={stars} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <Typography variant="body2" sx={{ minWidth: 20 }}>
                                                    {stars}
                                                </Typography>
                                                <Box sx={{ width: 16, height: 16, mx: 1 }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffd700">
                                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                                    </svg>
                                                </Box>
                                                <Box sx={{ flex: 1, mx: 2, height: 8, backgroundColor: '#f0f0f0', borderRadius: 4 }}>
                                                    <Box 
                                                        sx={{ 
                                                            width: `${percentage}%`, 
                                                            height: '100%', 
                                                            backgroundColor: '#ffd700', 
                                                            borderRadius: 4 
                                                        }} 
                                                    />
                                                </Box>
                                                <Typography variant="body2" sx={{ minWidth: 30, textAlign: 'right' }}>
                                                    {count}
                                                </Typography>
                                            </Box>
                                        );
                                    })}
                                </Box>

                                {/* Badge de recomendación */}
                                {product?.resenias && product.resenias.length > 0 && (
                                    <Box sx={{ 
                                        mt: 3, 
                                        p: 2, 
                                        backgroundColor: '#e8f5e8', 
                                        borderRadius: 2,
                                        border: '1px solid #c3e6c3'
                                    }}>
                                        <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                                            {Math.round((product.resenias.filter(r => r.valoracion >= 4).length / product.resenias.length) * 100)}% de los clientes recomiendan este producto.
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Grid>

                        {/* Columna derecha - Lista de comentarios */}
                        <Grid size={{xs:12, sm:12, md:8}}>
                            {product?.resenias && product.resenias.length > 0 ? (
                                <Box>
                                    {product.resenias.slice(0, 5).map((resenia, index) => (
                                        <Box key={index} sx={{ mb: 4, pb: 3, borderBottom: '1px solid #f0f0f0' }}>
                                            {/* Header del comentario */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Rating 
                                                    value={resenia.valoracion} 
                                                    readOnly 
                                                    size="small"
                                                    sx={{ mr: 2 }}
                                                />
                                                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                                                    hace {Math.floor(Math.random() * 30) + 1} días
                                                </Typography>
                                            </Box>

                                            {/* Título del comentario (si existe) */}
                                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                {resenia.valoracion === 5 ? 'Excelente' : 
                                                resenia.valoracion === 4 ? 'Muy bueno' :
                                                resenia.valoracion === 3 ? 'Bueno' :
                                                resenia.valoracion === 2 ? 'Regular' : 'Malo'}
                                            </Typography>

                                            {/* Nombre del usuario */}
                                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                                                por {(resenia as any).user?.name || 'Usuario anónimo'}
                                            </Typography>

                                            {/* Comentario */}
                                            <Typography variant="body2" sx={{ lineHeight: 1.6, mb: 2 }}>
                                                {resenia.comentario}
                                            </Typography>

                                            {/* Botones de útil/no útil
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button 
                                                    size="small" 
                                                    variant="outlined" 
                                                    sx={{ 
                                                        minWidth: 'auto', 
                                                        p: 1,
                                                        borderColor: '#e0e0e0',
                                                        color: 'text.secondary',
                                                        fontSize: '0.75rem'
                                                    }}
                                                >
                                                    👍
                                                </Button>
                                                <Button 
                                                    size="small" 
                                                    variant="outlined" 
                                                    sx={{ 
                                                        minWidth: 'auto', 
                                                        p: 1,
                                                        borderColor: '#e0e0e0',
                                                        color: 'text.secondary',
                                                        fontSize: '0.75rem'
                                                    }}
                                                >
                                                    👎
                                                </Button>
                                            </Box> */}
                                        </Box>
                                    ))}

                                    {/* Botón ver más comentarios */}
                                    {product.resenias.length > 5 && (
                                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                                            <Button 
                                                variant="outlined" 
                                                sx={{ 
                                                    textTransform: 'none',
                                                    borderRadius: '50px',
                                                    px: 4,
                                                    py: 1
                                                }}
                                            >
                                                Ver más comentarios ({product.resenias.length - 5} restantes)
                                            </Button>
                                        </Box>
                                    )}
                                </Box>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 8 }}>
                                    <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
                                        Aún no hay comentarios
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                                        Sé el primero en comentar este producto al adquirirlo
                                    </Typography>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
            <Dialog open={openModal} onClose={() => setOpenModal(false)} PaperProps={{
                sx: {
                position: 'absolute',
                top: 16,
                right: 16,
                m: 0,
                width: 400, // Puedes ajustar el ancho si deseas
                borderRadius: 3,
                },
            }}>
                <DialogTitle sx={{ fontWeight: 'bold' }}>¡Producto agregado al carrito!</DialogTitle>
                <DialogContent>
                    {lastAddedProduct && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Image
                            src={lastAddedProduct.images[0]}
                            alt={lastAddedProduct.name}
                            width={100}
                            height={100}
                        />
                        <Box>
                            <Typography fontWeight="bold">{lastAddedProduct.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Talla: {selectedSize} — Cantidad: {quantity}
                            </Typography>
                            <Typography variant="body2" color="text.primary" fontWeight="bold">
                                S/ {(lastAddedProduct.price).toFixed(2)}
                            </Typography>
                        </Box>
                    </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={() => setOpenModal(false)} variant="outlined" color="primary">
                        Seguir comprando
                    </Button>
                    <Link href="/carrito">
                        <Button variant="contained" sx={{ backgroundColor: 'black', color: 'white' }}>
                            Ir al carrito
                        </Button>
                    </Link>
                </DialogActions>
            </Dialog>
            <Dialog open={openSizeGuide} onClose={() => setOpenSizeGuide(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Guía de Tallas Perú - Mujer</DialogTitle>
                <DialogContent>
                    <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Mide tu pie desde el talón hasta el dedo más largo (en centímetros) y compara con la siguiente tabla de tallas peruanas para mujer.
                    </Typography>

                    <Box
                        sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        overflow: 'hidden',
                        mt: 1
                        }}
                    >
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f5f5f5' }}>
                            <tr>
                            <th style={{ padding: '8px', fontSize: 14 }}>PE</th>
                            <th style={{ padding: '8px', fontSize: 14 }}>CM</th>
                            <th style={{ padding: '8px', fontSize: 14 }}>US</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                            { pe: 34, cm: 21.5, us: 4 },
                            { pe: 35, cm: 22.0, us: 5 },
                            { pe: 36, cm: 22.5, us: 5.5 },
                            { pe: 37, cm: 23.5, us: 6.5 },
                            { pe: 38, cm: 24.0, us: 7 },
                            { pe: 39, cm: 24.5, us: 8 },
                            { pe: 40, cm: 25.0, us: 8.5 },
                            { pe: 41, cm: 25.5, us: 9 },
                            { pe: 42, cm: 26.0, us: 10 }
                            ].map((row) => (
                            <tr key={row.pe}>
                                <td style={{ padding: '8px', textAlign: 'center' }}>{row.pe}</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>{row.cm} cm</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>{row.us}</td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button onClick={() => setOpenSizeGuide(false)} variant="contained">
                    Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
            <FooterComponent/>
        </>
    )
}

export default MainProductDetail
