import { Box, Button, CircularProgress, Container, InputBase, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail } from '../../Redux/Slices/AuthSlice';
import { Navigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';

const VerifyEmailSchema = yup.object().shape({
  otp: yup.array().of(yup.string().length(1, 'Each OTP digit must be exactly 1 character')).required('OTP is required').length(6, 'OTP must be exactly 6 digits'),
});

const OtpVerification = () => {
  const dispatch = useDispatch();
const { isVerifiedEmail, isLoading } = useSelector((state) => state.auth);
const emailFromState = useSelector((state) => state.auth.registerEmail);
const [email, setEmail] = React.useState(emailFromState || '');
const [otp, setOtp] = React.useState(["", "", "", "", "", ""]);

const otpRefs = useRef([]);

useEffect(() => {
    otpRefs.current = otpRefs.current.slice(0, 6);
  }, []);

  useEffect(() => {
    if (emailFromState) setEmail(emailFromState);
  }, [emailFromState]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9A-Z]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < otp.length - 1) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
  
      if (otp[index] === "") {
        // Move focus to the previous input field if the current one is empty
        if (index > 0) {
          otpRefs.current[index - 1]?.focus();
        }
      } else {
        // Clear the current field and move focus to the previous input
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(VerifyEmailSchema),
    defaultValues: {
      otp: Array(6).fill(''),
    },
  });

  const onSubmit = async (data) => {
    const otpCode = data.otp.join('');
    const submissionData = { otp: otpCode, email: data.email };
    dispatch(verifyEmail(submissionData));
  };
 

  if (isVerifiedEmail) {
    return <Navigate to={"/login"} />;
  }

  return (
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
          Verify Your Email
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: 'white' }}>
          We've sent an OTP to your email. Please enter it below to verify your account.
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
         <Box
      sx={{
        marginBottom: "16px",
        opacity: 1,
        background: "transparent",
        color: "#344767",
      }}
    >
      <Controller
        name="email"
        control={control}
        defaultValue={email}
        render={({ field }) => (
          <TextField
            {...field}
            label="Enter Email"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        )}
      />
    </Box>
      <Box display="flex" justifyContent="space-between" maxWidth={300} mx="auto">

        {Array(6).fill("").map((_, index) => (
          <Controller
            key={index}
            name={`otp[${index}]`}
            control={control}
            render={({ field }) => (
              <InputBase
                {...field}
                value={otp[index]} // Use otp state for value
                onChange={(e) => {
                  field.onChange(e.target.value); // Update field value
                  handleChange(e, index); // Handle local change
                }}
                onKeyDown={(e) => handleKeyDown(e, index)}
                inputRef={(el) => (otpRefs.current[index] = el)} // Assign ref
                id={`otp-${index}`}
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: "center",
                    fontSize: "20px",
                    textTransform: "uppercase",
                  },
                }}
                sx={{
                  width: "40px",
                  height: "40px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  mx: 1,
                }}
              />
            )}
          />
        ))}
      </Box>
      <Box sx={{ marginLeft: "-8px", paddingY: 2, position: "relative" ,marginTop:2}}>
        <Button variant="contained" fullWidth type="submit" disabled={isLoading}>
          VERIFY EMAIL
        </Button>
        {isLoading && (
          <CircularProgress
            size={24}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: "-12px",
              marginLeft: "-12px",
            }}
          />
        )}
      </Box>
    </form>
      </Box>
    </Container>
  );
};

export default OtpVerification;
