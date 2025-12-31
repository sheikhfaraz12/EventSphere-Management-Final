import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

export default function Navbar({ currentPage, setCurrentPage }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setCurrentPage('home');
  };

  const menuButton = (label, page, extraProps = {}) => (
    <Button
      variant={currentPage === page ? 'contained' : 'outlined'}
      onClick={extraProps.onClick || (() => setCurrentPage(page))}
      sx={{
        background:
          currentPage === page
            ? 'linear-gradient(90deg, #1e3c72, #2a5298)'
            : 'transparent',
        color: 'white',
        borderColor: 'white',
        '&:hover': {
          background: 'linear-gradient(90deg, #1e3c72, #2a5298)',
          color: 'white',
        },
        textTransform: 'none',
        fontWeight: 600,
        ...extraProps.sx,
      }}
    >
      {label}
    </Button>
  );

  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          sx={{
            cursor: 'pointer',
            fontWeight: 700,
            '&:hover': { opacity: 0.9 },
          }}
          onClick={() => setCurrentPage('home')}
        >
          Event Sphere
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {menuButton('Home', 'home')}
          {menuButton('Events', 'events')}
          {menuButton('Bookings', 'bookings')}
          {user ? (
            <>
              {user.role === 'admin' && menuButton('Admin Panel', 'admin')}
              {menuButton('Logout', '', {
                sx: { background: '#ff4d4f', '&:hover': { background: '#e33d3f' } },
                onClick: handleLogout, // ✅ now this will work
              })}
            </>
          ) : (
            <>
              {menuButton('Signup', 'signup')}
              {menuButton('Login', 'login')}
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
