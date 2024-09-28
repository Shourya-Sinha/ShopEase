import { Box, Button, Container, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { resetPassword } from '../../Redux/Slices/AuthSlice';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const location = useLocation(); // Get location object
  const queryParams = new URLSearchParams(location.search); // Parse query parameters
  const token = queryParams.get('token'); // Extract the token
  const  isLoading  = useSelector((state) => state.auth.isLoading);
  const isResetPasswordSuccessfull = useSelector((state) => state.auth.isResetPasswordSuccessfull);
  const [showPassword, setShowPassword] = useState(false);
  // const userId = useSelector((state)=>state.auth.)
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  const loginSchema = Yup.object().shape({
    password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/[a-z]/, 'Password must contain a lowercase letter')
    .matches(/[A-Z]/, 'Password must contain an uppercase letter')
    .matches(/[0-9]/, 'Password must contain a number')
    .matches(/[@$!%*?&#]/, 'Password must contain a special character')
    .required('Password is required'),
    confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required')
  });


  const { handleSubmit, register, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
  });

  // const onSubmit = async (data) => {
  //   console.log('Form submitted');
  // console.log('Data', data); 
  // const payload = {
  //   ...data,
  //   token
  // };
  // console.log('Payload', payload);
  //   // dispatch(resetPassword(payload)); // Send to the backend
  // };
  const onSubmit = (data) => {
    console.log('Form submitted');    // Log the form submission event
    console.log('Data:', data);       // Log the form data including password and confirmPassword
    
    const payload = {
      ...data,
      token,  // Attach the token from the URL
      // userId:
    };
  
    console.log('Payload:', payload); // Check the final payload for dispatch
    dispatch(resetPassword(payload)); // Send the payload to the backend for processing
  };

  useEffect(()=>{
   if(isResetPasswordSuccessfull){
    navigate('/login');
   }
  },[dispatch,isResetPasswordSuccessfull])
  return (
    <>
          <Container maxWidth="sm" sx={{ marginTop: 8 }}>
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
            Reset Password
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={5}>

{/* <TextField
label="Password"
// type="password"
type={showPassword ? 'text' : 'password'}
fullWidth
required
{...register('password')}
error={!!errors.password}
helperText={errors.password?.message}
                autoComplete="off"
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
                        {showPassword ? <Visibility /> : <VisibilityOff />} 
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

<TextField
label="Confirm Password"
// type="password"
type={showPassword ? 'text' : 'password'}
fullWidth
required
{...register('confirmPassword')}
error={!!errors.confirmPassword}
helperText={errors.confirmPassword?.message}
                autoComplete="off"
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
                        {showPassword ? <Visibility /> : <VisibilityOff />} 
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              /> */}
              <TextField
  label="Password"
  type={showPassword ? 'text' : 'password'}
  fullWidth
  required
  {...register('password')}  // Register password input
  error={!!errors.password}
  helperText={errors.password?.message}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end" sx={{marginTop:4,paddingRight:1}}>
        <IconButton
          onClick={handleClickShowPassword}
          onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
          edge="end"
        >
          {showPassword ? <Visibility /> : <VisibilityOff />} 
        </IconButton>
      </InputAdornment>
    ),
  }}
/>

<TextField
  label="Confirm Password"
  type={showPassword ? 'text' : 'password'}
  fullWidth
  required
  {...register('confirmPassword')}  // Register confirm password input
  error={!!errors.confirmPassword}
  helperText={errors.confirmPassword?.message}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end" sx={{marginTop:4,paddingRight:1}}>
        <IconButton
          onClick={handleClickShowPassword}
          onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
          edge="end"
        >
          {showPassword ? <Visibility /> : <VisibilityOff />} 
        </IconButton>
      </InputAdornment>
    ),
  }}
/>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{
                  backgroundColor: '#FFB6C1',
                  color: 'white',
                  fontWeight: 'bold',
                  paddingY: 1.5,
                  '&:hover': { backgroundColor: '#FF69B4' },
                }}
                disabled={isLoading}
              >
                {isLoading ? 'Checking...' : 'Confirm Change Password'}
              </Button>
            </Stack>
          </form>

          <Typography variant="body2" sx={{ color: 'white', mt: 3 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#eb2f96', textDecoration: 'none' }}>
              Log In
            </Link>
          </Typography>
        </Box>
      </Container>
    </>
  )
}

export default ResetPassword;