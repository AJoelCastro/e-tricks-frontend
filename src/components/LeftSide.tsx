import { Divider, List, ListItem, ListItemText, styled, Typography  } from '@mui/material'
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
  color: 'black',
  transition: 'color 300ms',
  ':hover': {
    color: '#7950f2'
  },
  ...(isActive && {
    color: '#7950f2'
  })
}));
const LeftSide = () => {
const pathname = usePathname();
    const isActive = (path: string) => pathname === path;
  return (
    <div className='h-[100vh] bg-[#fafefa] w-[25vw]'>
      <div className='flex px-8 justify-center items-center'>
        <Typography variant='h4' sx={{mt: 4, fontFamily: 'Comic Sans MS'}} >
            Favoritos
        </Typography>
      </div>
      <div>
        
      </div>
      <div className='px-8'>
        <List sx={style} aria-label="mailbox folders">
            <ListItem>
                <StyledNavItem href="/favorites" isActive={isActive('/favorites')}>
                    <ListItemText primary="Favorites" />
                </StyledNavItem>
            </ListItem>
            <Divider component="li" />
            <ListItem>
                <ListItemText primary="Drafts" />
            </ListItem>
            <Divider component="li" />
            <ListItem>
                <ListItemText primary="Trash" />
            </ListItem>
            <Divider component="li" />
            <ListItem>
                <ListItemText primary="Spam" />
            </ListItem>
            </List>
      </div>
    </div>
  )
}

export default LeftSide
