import { Avatar, Box, Button, Container, Paper, Stack, Typography } from '@mui/material';
import React from 'react'

const Profile = () => {
  return (
    <>
 <Container
      maxWidth="lg"
      sx={{
        background: 'linear-gradient(145deg, #003a8c, #0053d1)',
        borderRadius: 3,
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3), 0 4px 10px rgba(255, 255, 255, 0.1) inset',
        padding: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-100px',
          left: '-100px',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          animation: 'shine 4s infinite',
        },
        '@keyframes shine': {
          '0%': { transform: 'translateX(0) translateY(0)' },
          '50%': { transform: 'translateX(100px) translateY(100px)' },
          '100%': { transform: 'translateX(0) translateY(0)' },
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        {/* User Image */}
        <Stack alignItems={'center'}>
        <Avatar
          src="path/to/user/image.jpg" // Replace with actual user image path
          sx={{ width: 100, height: 100, borderRadius: '50%', border: '5px solid white' }}
        />
       <Box marginTop={4}>
       <Button variant='contained' color='secondary'>Update Image</Button>
       </Box>
        </Stack>
       
       
        {/* User Details */}
        <Stack sx={{marginTop:-5}}>
          <Typography sx={{ fontSize: 30, fontWeight: 500, color: 'salmon' }}>John Doe</Typography>
          <Typography sx={{ fontSize: 18, color: 'white' }}>Email: john.doe@example.com</Typography>
          <Typography sx={{ fontSize: 18, color: 'white' }}>Joined: January 2022</Typography>
          <Typography sx={{ fontSize: 18, color: 'white' }}>Address: 123,New Street NewYork</Typography>
        </Stack>
      </Box>

      {/* Additional Info Boxes */}
      <Stack direction="row" spacing={2} paddingTop={4}>
        <Paper
          sx={{
            flex: 1,
            padding: 2,
            borderRadius: 2,
            backgroundColor: '#0053d1',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6">Products Purchased</Typography>
          <Typography variant="h4">15</Typography>
        </Paper>
        <Paper
          sx={{
            flex: 1,
            padding: 2,
            borderRadius: 2,
            backgroundColor: '#0053d1',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6">Expense Tracker</Typography>
          <Typography variant="h4">$1200</Typography>
        </Paper>
        <Paper
          sx={{
            flex: 1,
            padding: 2,
            borderRadius: 2,
            backgroundColor: '#0053d1',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6">Last Purchase</Typography>
          <Typography variant="h4">September 2024</Typography>
        </Paper>
      </Stack>
    </Container>
    </>
  )
}

export default Profile;