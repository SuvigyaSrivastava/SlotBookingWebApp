import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, AppBar, Toolbar, Typography, PaletteMode } from '@mui/material';
import { Home, LayoutDashboard, UserCircle, LogOut, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { logout } from '../utils/storage';

const drawerWidth = 240;

interface LayoutProps {
  children: React.ReactNode;
  toggleTheme: () => void;
  mode: PaletteMode;
}

const Layout = ({ children, toggleTheme, mode }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Home', icon: <Home size={24} />, path: '/' },
    { text: 'Dashboard', icon: <LayoutDashboard size={24} />, path: '/dashboard' },
    { text: 'Profile', icon: <UserCircle size={24} />, path: '/profile' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: (theme) => theme.palette.background.paper,
          color: (theme) => theme.palette.text.primary,
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Slot Booking App
          </Typography>
          <IconButton onClick={toggleTheme} sx={{ mr: 2 }}>
            {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </IconButton>
          <IconButton onClick={handleLogout}>
            <LogOut size={20} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            marginTop: '64px',
            backgroundColor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider'
          },
        }}
      >
        <List>
          {menuItems.map((item) => (
            <motion.div
              key={item.text}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ListItem
                button
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  my: 0.5,
                  mx: 1,
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    }
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: location.pathname === item.path ? 'white' : 'inherit',
                  minWidth: 40 
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            </motion.div>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '64px',
          backgroundColor: 'background.default',
          minHeight: '100vh'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;