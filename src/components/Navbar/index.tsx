import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  ListItemButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';

const navItems = [
  { text: 'Deploy Now', href: 'https://vercel.com/new' },
  { text: 'Docs', href: 'https://nextjs.org/docs' },
  { text: 'Learn', href: 'https://nextjs.org/learn' },
  { text: 'Examples', href: 'https://vercel.com/templates' },
  { text: 'Next.js', href: 'https://nextjs.org' },
];

export const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: 'var(--darkBackground)' }} elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div">
            AI-Driven Synthetic Chat Generation
          </Typography>

          {isMobile ? (
            <>
              <IconButton edge="end" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
                  <List>
                    {navItems.map(({ text, href }) => (
                      <ListItem key={text} disablePadding>
                        <ListItemButton component="a" href={href} target="_blank" rel="noopener noreferrer">
                          <ListItemText primary={text} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {navItems.map(({ text, href }) => (
                <Button key={text} color="inherit" component="a" href={href} target="_blank" rel="noopener noreferrer">
                  {text}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};
