import theme from '@/theme/create-theme';
import { useUser } from '@clerk/nextjs';
import { Divider, List, ListItem, styled, Typography  } from '@mui/material'
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
const LeftSide = () => {

    const { user } = useUser();
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;
    return (
        <div className='h-[100vh]  w-[25vw] flex flex-col gap-[4vh]'>
            <div className='flex mx-8 justify-center items-center rounded-lg'>
                <Typography variant='h2' >
                    MIS FAVORITOS
                </Typography>
            </div>
            <div className='flex mx-8 justify-center items-center bg-white rounded-xl px-8 py-6'>
                <Typography variant='hEspecial'>
                    HOLA, {user?.firstName?.toUpperCase()}
                </Typography>
            </div>
            <div className='px-8'>
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
                        <StyledNavItem href="/drafts" isActive={isActive('/drafts')}>
                            <Typography>
                                MIS COMPRAS
                            </Typography>
                        </StyledNavItem>
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                        <StyledNavItem href="/trash" isActive={isActive('/trash')}>
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
            </div>
        </div>
    )
}

export default LeftSide
