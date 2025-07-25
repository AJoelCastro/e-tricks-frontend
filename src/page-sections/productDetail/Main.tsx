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
        <>
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
                    {/* cuadro de caracteristicas */}
                    <Grid size={{xs:12, sm:12, md:8}} sx={{ backgroundColor: '#f8f9fa', borderRadius: 2, p: 3, mt: 4, mx:{xs:1,sm:2,md:4}, mb:{xs:2,sm:2,md:4} }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                            Características del producto
                        </Typography>

                        <Box
                            sx={{
                            maxHeight: expanded ? 'none' : 160,
                            overflow: 'hidden',
                            position: 'relative',
                            transition: 'max-height 0.3s ease',
                            filter: expanded ? 'none' : 'blur(2px)',
                            pr: 1
                            }}
                        >
                            <Grid container spacing={1}>
                            {[
                                'Material exterior: Cuero sintético de alta calidad',
                                'Forro interior: Textil acolchado',
                                'Suela: Goma antideslizante',
                                'Altura del taco: 3.5 cm',
                                'Diseñado para uso diario',
                                'Hecho en Perú',
                                'Resistente al agua',
                                'Disponible solo en colores neutros',
                                'Recomendado por podólogos',
                                'Ajuste ergonómico para mayor confort'
                            ].map((feature, index) => (
                                <Grid size={{xs:12, sm:6}} key={index}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                    <CheckCircle size={18} color="#5f3dc4" />
                                    <Typography sx={{ fontSize: 14 }}>{feature}</Typography>
                                </Box>
                                </Grid>
                            ))}
                            </Grid>

                            {!expanded && (
                            <Box
                                sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '100%',
                                background: 'linear-gradient(to bottom, rgba(248,249,250,0.0), rgba(248,249,250,1))',
                                }}
                            />
                            )}
                        </Box>

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setExpanded(prev => !prev)}
                            sx={{ textTransform: 'none', fontWeight: 500 }}
                            >
                            {expanded ? 'Ver menos' : 'Ver todas las características'}
                            </Button>
                        </Box>
                    </Grid>
                </>
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
        </>
    )
}

export default MainProductDetail
