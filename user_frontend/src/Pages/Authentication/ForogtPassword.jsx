import { Box, Button, Container, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../../Redux/Slices/AuthSlice';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

const ForogtPassword = () => {
  const dispatch = useDispatch();
  const isLoading  = useSelector((state) => state.auth.isLoading);
  const isSuccessfull = useSelector((state) => state.auth.isSendTokenSuccess);
  const navigate = useNavigate();
  const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email format').required('Email is required'),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });

  const onSubmit = async (data) => {
    dispatch(forgotPassword(data.email));
  };

  useEffect(()=>{
   if(isSuccessfull){
    navigate('/login');
   }
  },[dispatch,isSuccessfull])

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
            Forgot Password
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={5}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
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
                {isLoading ? 'Sending Link...' : 'Send Link'}
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
  );
};

export default ForogtPassword;
