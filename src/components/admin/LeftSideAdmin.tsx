'use client';

import theme from '@/theme/create-theme';
import { useUser } from '@clerk/nextjs';
import {
  Box,
  Divider,
  List,
  ListItem,
  styled,
  Typography,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const style = {
  p: 0,
  width: '100%',
  borderRadius: 2,
  borderColor: 'divider',
  backgroundColor: 'background.paper',
};

const StyledNavItem = styled(Link, {
  shouldForwardProp: (prop) => prop !== 'isActive'
})(({ isActive }: { isActive: boolean }) => ({
  color: '#373737ff',
  transition: 'color 300ms',
  ':hover': {
    color: '#7950f2',
  },
  ...(isActive && {
    color: '#7950f2',
  }),
}));


const LeftSideAdmin= () => {
  const { user } = useUser();
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const isMobile = useMediaQuery('(max-width:600px)');

  const links = [
    { href: '/admin', label: 'DASHBOARD' },
    { href: '/admin/ordenes', label: 'ORDENES' },
    { href: '/admin/productos', label: 'PRODUCTOS' },
    { href: '/admin/productosS3', label: 'AWS S3 PRODUCTOS' },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center',paddingX: 6, paddingY: 3, backgroundColor: 'white', borderRadius: 2, marginX: 2,  marginTop: 3, marginBottom:2 }}>
        <Typography variant="leftside">
          HOLA, {user?.firstName?.toUpperCase()}
        </Typography>
      </Box>

      <Box sx={{ paddingX: 2}}>
        {isMobile ? (
          <Accordion elevation={1} sx={{ borderRadius: 2, paddingY:1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="priceCard">Menú de navegación</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List sx={style}>
                {links.map((link, i) => (
                  <React.Fragment key={i}>
                    <ListItem>
                      <StyledNavItem href={link.href} isActive={isActive(link.href)}>
                        <Typography variant="productCategory">{link.label}</Typography>
                      </StyledNavItem>
                    </ListItem>
                    {i < links.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ) : (
          <List sx={style}>
            {links.map((link, i) => (
              <React.Fragment key={i}>
                <ListItem>
                  <StyledNavItem href={link.href} isActive={isActive(link.href)}>
                    <Typography variant="productCategory">{link.label}</Typography>
                  </StyledNavItem>
                </ListItem>
                {i < links.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default LeftSideAdmin;
