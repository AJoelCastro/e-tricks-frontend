// Versión MUI de NavbarComponent
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { User, Heart, ShoppingBag, Search, Menu, X } from "lucide-react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import SearchSidebar from '../modal/SearchSidebar';

const NavbarComponent = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Mujer', href: '/women' },
    { label: 'Marcas', href: '/marcas' },
  ];

  const mobileNavItems = [
    { label: 'Productos', href: '/productos' },
    { label: 'Servicios', href: '/servicios' },
    { label: 'Contacto', href: '/contacto' },
  ];

  const renderNavLinks = () => (
    navItems.map((item) => (
      <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
        <Typography
          variant="body2"
          sx={{
            color: isScrolled ? 'text.primary' : 'white',
            mx: 1.5,
            fontWeight: 500,
            '&:hover': { color: 'primary.main' },
          }}
        >
          {item.label}
        </Typography>
      </Link>
    ))
  );

  const drawer = (
    <Box sx={{ width: 250 }} onClick={() => setMobileOpen(false)}>
      <List>
        {mobileNavItems.map((item) => (
          <ListItem key={item.href} disablePadding>
            <ListItemButton component={Link} href={item.href}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem>
          <ListItemButton onClick={() => setIsSearchOpen(true)}>
            <ListItemIcon><Search /></ListItemIcon>
            <ListItemText primary="Buscar" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={isScrolled ? 4 : 0}
        sx={{
          backgroundColor: isScrolled ? 'background.paper' : 'transparent',
          transition: 'background-color 0.3s',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>

          {/* Menú Izquierdo */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {renderNavLinks()}
            </Box>
          )}

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              src="/tricks_logo_black.svg"
              alt="Logo"
              width={32}
              height={32}
              style={{ height: 64, width: 'auto' }}
            />
          </Link>

          {/* Iconos derecha */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!isMobile && (
              <>
                <IconButton onClick={() => setIsSearchOpen(true)}>
                  <Search color={isScrolled ? 'black' : 'white'} />
                </IconButton>
                <IconButton component={Link} href="/favorites">
                  <Heart color={isScrolled ? 'black' : 'white'} />
                </IconButton>
                <IconButton component={Link} href="/cart">
                  <ShoppingBag color={isScrolled ? 'black' : 'white'} />
                </IconButton>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <IconButton>
                      <User color={isScrolled ? 'black' : 'white'} />
                    </IconButton>
                  </SignInButton>
                </SignedOut>
              </>
            )}
            {isMobile && (
              <IconButton onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X /> : <Menu color={isScrolled ? 'black' : 'white'} />}
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        {drawer}
      </Drawer>

      <Toolbar /> {/* Offset para AppBar fijo */}
      <SearchSidebar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default NavbarComponent;