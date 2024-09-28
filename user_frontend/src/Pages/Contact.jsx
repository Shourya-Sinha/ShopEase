import { Box, Button, Container, Stack, TextField, Typography } from '@mui/material'
import React from 'react';
import contactImage from '../assets/Images/contact.jpg'

const Contact = () => {
  return (
<Container maxWidth="lg" sx={{ marginTop: 4 }}>
      {/* Background Image Box with Text Overlay */}
      <Box
        sx={{
          backgroundImage: `url(${contactImage})`, // Replace with your image URL
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          padding: 4,
          borderRadius: 2,
          textAlign: 'center',
          position: 'relative',
          marginBottom: 4,
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
          Contact Us
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          We would love to hear from you! Fill out the form below and our team will get in touch with you shortly.
        </Typography>
      </Box>

      {/* Contact Form */}
      <Box
        sx={{
          backgroundColor: 'white',
          padding: 4,
          borderRadius: 2,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Get in Touch
        </Typography>
        <Stack spacing={2}>
          <TextField fullWidth label="Full Name" variant="outlined" />
          <TextField fullWidth label="Email" variant="outlined" type="email" />
          <TextField fullWidth label="Phone Number" variant="outlined" type="tel" />
          <TextField fullWidth label="Message" variant="outlined" multiline rows={4} />
          <Button variant="contained" sx={{ backgroundColor: 'salmon', color: 'white', marginTop: 2 }}>
            Submit
          </Button>
        </Stack>
      </Box>
    </Container>
  )
}

export default Contact