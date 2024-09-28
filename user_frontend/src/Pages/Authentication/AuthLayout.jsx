import { Box, Container, Stack ,Link } from '@mui/material';
import React from 'react'
import { Link as RouterLink } from 'react-router-dom';
import backgroundImage from '../../assets/backgr2.jpg'

const AuthLayout = ({ children }) => {
  return (
    <Box
    sx={{
        position: 'relative', // Ensure the child content can stack over the background
        minHeight: '100vh', // Full screen height
        backgroundImage: `url(${backgroundImage})`, // Background image
        backgroundSize: 'cover', // Cover the entire background
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        '::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.5)', // Light semi-transparent overlay
          backdropFilter: 'blur(3px)', // Apply blur effect
          zIndex: -1, // Ensure the overlay is below the content
        },
        zIndex: 2, // Content z-index to be above the overlay
      }}
    >
      {/* Glass-Effect Header */}
      <Box
        sx={{
          width: '100%',
          padding: '20px 0',
          position: 'absolute',
          top: 0,
          display: 'flex',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)', // Glassmorphism effect
          backgroundColor: 'rgba(255, 255, 255, 0.2)', // Transparent glass effect
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', // Subtle shadow
        }}
      >
        <Stack direction="row" spacing={3}>
          <Link component={RouterLink} to="/" sx={{ textDecoration: 'none', color: '#eb2f96' }}>
            Home
          </Link>
          <Link component={RouterLink} to="/register" sx={{ textDecoration: 'none', color: '#eb2f96' }}>
            Register
          </Link>
          <Link component={RouterLink} to="/login" sx={{ textDecoration: 'none', color: '#eb2f96' }}>
            Login
          </Link>
          <Link component={RouterLink} to="/forgot-password" sx={{ textDecoration: 'none', color: '#eb2f96' }}>
            Forgot Password
          </Link>
        </Stack>
      </Box>

      {/* Page Content */}
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
          borderRadius: 3,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          padding: 4,
          marginTop: '80px',
          textAlign: 'center',
        }}
      >
        {children} {/* Render login, register, or forgot password form */}
      </Container>
    </Box>
  )
}

export default AuthLayout;