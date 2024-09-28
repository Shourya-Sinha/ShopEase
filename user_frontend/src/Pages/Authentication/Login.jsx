import { Box, Button, Container, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom';
import './AuthStyle.css';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { loginUser } from '../../Redux/Slices/AuthSlice';
import { Visibility, VisibilityOff } from '@mui/icons-material';


const Login = () => {
  const dispatch = useDispatch();
  const {isLoading,isLoggedIn} = useSelector((state)=> state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  const loginSchema=Yup.object().shape({
    email: Yup.string().email('Invalid email format').required('Email is Required'),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const {
    handleSubmit,
    register,
    formState: {errors},
  }=useForm({resolver: yupResolver(loginSchema)});

  const onSubmit= async (data)=>{
    dispatch(loginUser(data));
  };

  if(isLoggedIn){
    return <Navigate to={'/'} />;
  }
  return (
    <Container maxWidth="sm" sx={{ marginTop: 8 }}>
    {/* Animated Box with Gradient Background */}
    <Box
      sx={{
        background: 'linear-gradient(135deg, #FFB6C1, #00BFFF)',
        borderRadius: 3,
        padding: 5,
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        animation: 'fadeIn 1s ease-in-out',
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: 'white' }}>
        Welcome to Shopease
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'white' }}>
        Log in to continue shopping!
      </Typography>

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit )}>
        <Stack spacing={5}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            autoComplete='off'
            sx={{
              input: { color: 'white' },
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& > fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: '#FFB6C1' },
              },
            }}
          />
          <TextField
            label="Password"
            // type="password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            required
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{
              input: { color: 'white' },
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& > fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: '#FFB6C1' },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{marginTop:4,paddingRight:1}}>
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />} {/* Show/hide icon */}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Login Button */}
          <Button
            fullWidth
            variant="contained"
            type='submit'
            sx={{
              backgroundColor: '#FFB6C1',
              color: 'white',
              fontWeight: 'bold',
              paddingY: 1.5,
              '&:hover': {
                backgroundColor: '#FF69B4',
              },
            }}
            disabled={isLoading}
          >
            
            {isLoading ? 'LoggingIn...' : 'Login'}
          </Button>
        </Stack>
      </form>

      {/* Registration Link */}
      <Typography variant="body2" sx={{ color: 'white', mt: 3 }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: '#eb2f96', textDecoration: 'none' }}>
          Register here
        </Link>
      </Typography>

     
      <Typography variant="body2" sx={{ color: 'white', mt: 3 }}>
        You Forgot Your Passowrd?
        <Link to={'/forgot-password'} style={{ color: '#eb2f96', textDecoration: 'none' }} >Forgot Password</Link>
      </Typography>
    </Box>
  </Container>
  )
}

export default Login