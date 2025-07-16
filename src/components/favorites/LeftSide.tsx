import theme from '@/theme/create-theme';
import { useUser } from '@clerk/nextjs';
import { Box, Divider, List, ListItem, styled, Typography  } from '@mui/material'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
const style = {
  p: 0,
  width: '100%',
  maxWidth: 360,
  borderRadius: 2,
  borderColor: 'divider',
  backgroundColor: 'background.paper',
};
const StyledNavItem = styled(Link, {
  shouldForwardProp: prop =>  prop !== 'isActive'
})(({
  isActive
}) => ({
  color: theme.palette.text.secondary,
  transition: 'color 300ms',
  ':hover': {
    color: '#7950f2'
  },
  ...(isActive && {
    color: '#7950f2'
  })
}));

type Props={
    title:string
}

const LeftSide:React.FC<Props> = ({title}) => {

    const { user } = useUser();
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;
    console.log("left side")
    return (
        <Box sx={{width: '100%'}}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginX: 4, marginY: 1 }} >
                <Typography variant='h4' sx={{fontFamily:'monospace'}}>
                    {title.toUpperCase()}
                </Typography>
            </Box>
            <Box sx={{ paddingX: 6, paddingY: 3, backgroundColor:'white', borderRadius: 2, marginX: 4, marginBottom: 4, marginTop:2 }} >

                <Typography variant='h6' sx={{fontFamily:'revert', fontWeight:'bold'}}>
                    HOLA, {user?.firstName?.toUpperCase()}
                </Typography>
            </Box>
            <Box sx={{ paddingX: 4, marginBottom: 8 }}>
                <List sx={style} aria-label="mailbox folders">
                    <ListItem>
                        <StyledNavItem href="/favorites" isActive={isActive('/favorites')}>
                            <Typography>
                                MIS FAVORITOS
                            </Typography>
                        </StyledNavItem>
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                        <StyledNavItem href="/cart" isActive={isActive('/cart')}>
                            <Typography>
                                MI CARRITO
                            </Typography>
                        </StyledNavItem>
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                        <StyledNavItem href="/compras" isActive={isActive('/compras')}>
                            <Typography>
                                MIS COMPRAS
                            </Typography>
                        </StyledNavItem>
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                        <StyledNavItem href="/addresses" isActive={isActive('/addresses')}>
                            <Typography>
                                DIRECCIONES
                            </Typography>
                        </StyledNavItem>
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                        <StyledNavItem href="/spam" isActive={isActive('/spam')}>
                            <Typography>
                                METODOS DE PAGO
                            </Typography>
                        </StyledNavItem>
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                        <StyledNavItem href="/spam" isActive={isActive('/spam')}>
                            <Typography>
                                MIS PUNTOS
                            </Typography>
                        </StyledNavItem>
                    </ListItem>
                </List>
            </Box>
        </Box>
    )
}

export default LeftSide
