import { Box, Button, Container, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom';
import './AuthStyle.css';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import {useDispatch, useSelector} from 'react-redux';
import { registerUser } from '../../Redux/Slices/AuthSlice';
import { useForm } from 'react-hook-form';

const Register = () => {
  const dispatch = useDispatch();
  const {isRegisterSuccessfull,isLoading} = useSelector((state)=> state.auth);

  const RegisterSchema= Yup.object().shape({
    firstName: Yup.string()
    .matches(/^[A-Za-z]+$/, "First Name should only contain letters")
      .required("First Name is required"),
      lastName: Yup.string()
      .matches(/^[A-Za-z]+$/, "Last Name should only contain letters")
      .required("Last Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    phoneNo: Yup.string()
      .matches(/^\d{10}$/, "Phone Number should be exactly 10 digits") // Adjust regex as needed
      .required("Phone Number is required"),
  });

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(RegisterSchema),
  });

  const onSubmit= async(data)=>{
    dispatch(registerUser(data));
  }

  if(isRegisterSuccessfull){
    return <Navigate to={'/verify-otp'} />;
  }

  return (
    <Container maxWidth="sm" sx={{ marginTop: 8 }}>
    {/* Animated Box with Gradient Background */}
    <Box
      sx={{
        background: 'linear-gradient(135deg, #00BFFF, #FFB6C1)',
        borderRadius: 3,
        padding: 5,
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        animation: 'fadeIn 1s ease-in-out',
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: 'white' }}>
        Join Shopease
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'white' }}>
        Create your account and start shopping!
      </Typography>

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <Stack direction={'row'} spacing={1}>
          <TextField
            label="firstName"
            fullWidth
            {...register('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            required
            sx={{
              input: { color: 'white' },
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& > fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: '#FFB6C1' },
                flexGrow:1
              },
            }}
          />
          <TextField
            label="firstName"
            fullWidth
            required
            {...register('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            sx={{
              input: { color: 'white' },
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& > fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: '#FFB6C1' },
                flexGrow:1
              },
            }}
          />
          </Stack>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
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
            type="password"
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
          />
          <TextField
            label="Phone No."
            type="tel"
            fullWidth
            required
            {...register('phoneNo')}
            error={!!errors.phoneNo}
            helperText={errors.phoneNo?.message}
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

          {/* Register Button */}
          <Button
            fullWidth
            variant="contained"
            type='submit'
            sx={{
              backgroundColor: '#00BFFF',
              color: 'white',
              fontWeight: 'bold',
              paddingY: 1.5,
              '&:hover': {
                backgroundColor: '#1E90FF',
              },
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
        </Stack>
      </form>

      {/* Login Link */}
      <Typography variant="body2" sx={{ color: 'white', mt: 3 }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#1f1f1f', textDecoration: 'none' }}>
          Log in here
        </Link>
      </Typography>
    </Box>
  </Container>
  )
}

export default Register