import { Box, Container, Stack, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Navigate, Link } from 'react-router-dom';

const PrivateRoute = ({ component: Component, layout: Layout }) =>  {
    const isLoggedIn = useSelector((state)=> state.auth.isLoggedIn);
    // const isAuthenticated = true;


    return isLoggedIn ? (
        <Layout>
          <Component />
        </Layout>
      ) : (
        <Layout>
        <Container minwidth='lg'>
            <Box sx={{minHeight:'400px',display:'flex',justifyContent:'center',flexDirection:'column',alignItems:'center' }}>
              <Typography sx={{fontSize:'1.2rem',fontWeight:700}}>For Acess This Page you need to Login</Typography>

              <Stack>
              <Typography sx={{fontSize:'5rem'}}>😢</Typography>
              </Stack>

              <Link to={'/login'} style={{fontSize:'1.3rem',fontWeight:700,fontFamily:'Roboto'}}>Login</Link>
            </Box>
        </Container>
        </Layout>
      );
    };

export default PrivateRoute